import React, { useState } from 'react';
import { NFTStorage } from 'nft.storage';
import { useContractLoader } from '../hooks';
import { Transactor } from '../helpers';
import { NFT_STORAGE_KEY, DEFAULT_CONTRACT_NAME } from '../constants';
import { ApiAxios } from '../api/Api';

async function mintNFT({
  contract,
  ownerAddress,
  provider,
  gasPrice,
  setStatus,
  image,
  name,
  description
}) {
  // First we use the nft.storage client library to add the image and metadata to IPFS / Filecoin
  const client = new NFTStorage({ token: NFT_STORAGE_KEY });
  setStatus('Uploading to nft.storage...');

  const metadata = await client.store({
    name,
    description,
    image
  });
  setStatus(`Upload complete! Minting token with metadata URI: ${metadata.url}`);

  // the returned metadata.url has the IPFS URI we want to add.
  // our smart contract already prefixes URIs with "ipfs://", so we remove it before calling the `mintToken` function
  const metadataURI = metadata.url.replace(/^ipfs:\/\//, '');

  // scaffold-eth's Transactor helper gives us a nice UI popup when a transaction is sent
  const transactor = Transactor(provider, gasPrice);
  const tx = await transactor(contract.mintToken(ownerAddress, metadataURI));

  setStatus('Blockchain transaction sent, waiting confirmation...');

  // Wait for the transaction to be confirmed, then get the token ID out of the emitted Transfer event.
  const receipt = await tx.wait();
  let tokenId = null;

  for (const event of receipt.events) {
    if (event.event !== 'Transfer') {
      continue;
    }
    tokenId = event.args.tokenId.toString();
    break;
  }
  setStatus(`Minted token #${tokenId}`);

  return tokenId;
}

export default function Minter({ customContract, gasPrice, signer, provider, name }) {
  const contracts = useContractLoader(signer);
  let contract;
  if (!name) {
    name = DEFAULT_CONTRACT_NAME;
  }
  if (!customContract) {
    contract = contracts ? contracts[name] : '';
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : '';

  const [file, setFile] = useState(null);
  const [previewURL, setPreviewURL] = useState(null);
  const [nftName, setName] = useState('');
  const [description, setDescription] = useState('');
  const [minting, setMinting] = useState(false);
  const [status, setStatus] = useState('');
  const [tokenId, setTokenId] = useState(null);
  const [nftImageName, setNftImageName] = useState(null);

  const [loading, setLoading] = useState(false);

  const handleNftImage = (e) => {
    setFile(e.target.files[0]);
    setPreviewURL(e.target.files[0]);
    setNftImageName(e.target.files[0].name);
    return false;
  };

  const startMinting = (e) => {
    e.preventDefault();

    setLoading(true);

    setMinting(true);
    signer.getAddress().then((ownerAddress) => {
      mintNFT({
        contract,
        provider,
        ownerAddress,
        gasPrice,
        setStatus,
        name: nftName,
        image: file,
        description
      }).then((newTokenId) => {
        setMinting(false);

        setTokenId(newTokenId);

        const user_id = localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user')).id
          : null;

        var data = new FormData();

        data.append('image', file);

        data.append('name', nftName);
        data.append('description', description);
        data.append('user_id', user_id);

        setLoading(true);

        ApiAxios.post(`/nfts`, data).then((res) => {
          setLoading(false);
        });

        setLoading(false);
      });
    });
  };

  return (
    <form onSubmit={startMinting}>
      <div className="form-line form-line-first">
        <div className="input input-text">
          <input
            type="text"
            name=""
            placeholder="NFT name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
        <div className="input input-upload input-upload-primary">
          <input
            type="file"
            name="file"
            id="banner"
            className="inputfile"
            onChange={handleNftImage}
            accept="image/png, image/gif, image/jpeg"
          />
          <label htmlFor="banner">
            <img src="/images/plus-rounded.png" alt="" />
            {file ? (
              <div className="text">{nftImageName}</div>
            ) : (
              <div className="text">
                Add NFT art work <span>( Jpeg or png )</span>
              </div>
            )}
          </label>
        </div>
      </div>
      <div className="form-line form-line-wide">
        <div className="input input-textarea">
          <textarea
            placeholder="Add a description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}></textarea>
        </div>
      </div>
      <div className="form-line two-inputs">
        <div className="input input-text">
          <input type="text" name="" placeholder="Expiration date   YYYY-MM-DD" />
          <a href="#" className="info">
            ?
          </a>
        </div>
        <div className="input input-text">
          <input type="text" name="" placeholder="How many NFT do you want to distribute ?" />
          <a href="#" className="info">
            ?
          </a>
        </div>
      </div>

      <div className="form-line form-line-actions">
        <button className="btn btn-primary" type="submit">
          {loading ? <span>Minting ...</span> : <span>Mint!</span>}
        </button>
      </div>
    </form>
  );
}
