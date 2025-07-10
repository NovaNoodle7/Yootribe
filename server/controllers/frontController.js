const {
  ERC20_ABI,
  WBNB,
  PAN_ROUTER,
  PAN_ROUTER3,
  PAN_ROUTER_UINVERSAL,
  PAN_ROUTER_UINVERSAL_OLD,
} = require("../constant/erc20");
const { FrontDetail, Token } = require("../models");
const ethers = require("ethers");
const chalk = require("chalk");
const Web3 = require("web3");
const app = require("../app.js");
const UniswapV3RouterABI = require("../constant/uniswapV3RouterABI.json");
const WETHABI = require("../constant/Weth.json");

const { Interface } = require("ethers/lib/utils");

var buy_method = [];
buy_method[0] = "0x7ff36ab5"; //swapExactETHForTokens
buy_method[1] = "0xb6f9de95"; //swapExactETHForTokensSupportingFeeOnTransferTokens
buy_method[2] = "0xfb3bdb41"; //swapETHForExactTokens

buy_method[3] = "0x18cbafe5"; //swapExactTokensForEth
buy_method[4] = "0x8803dbee"; //swapTokensforExactEth

buy_method[5] = "0xac9650d8"; //multicall in Uniswap v3 router.
buy_method[6] = "0x414bf389"; //exactInputSingle in Uniswap v3 router.

buy_method[7] = "0x3593564c"; // execute function in universal router

/*****************************************************************************************************
 * Find the new liquidity Pair with specific token while scanning the mempool in real-time.
 * ***************************************************************************************************/
async function scanMempool(
  node,
  wallet,
  amountInfo,
  inAmount,
  percent,
  minbnb,
  maxbnb
) {
  /**
   * Load the token list from the Tokens table.
   */

  console.log("--------------------- Scan mempool -------------------------");

  let tokens = await Token.findAll({
    attributes: ["address"],
    raw: true,
  });

  let walletMemory = [];
  tokens.map((item) => {
    walletMemory.push(item.address.toLowerCase());
  });

  console.log(walletMemory);

  let web3 = new Web3(new Web3.providers.WebsocketProvider(node));
  frontSubscription = web3.eth.subscribe("pendingTransactions", function(
    error,
    result
  ) {});
  var customWsProvider = new ethers.providers.WebSocketProvider(node);

  var ethWallet = new ethers.Wallet(amountInfo);

  const account = ethWallet.connect(customWsProvider);

  const router = new ethers.Contract(
    PAN_ROUTER,
    [
      "function getAmountsOut(uint amountIn, address[] memory path) public view returns (uint[] memory amounts)",
      "function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactETHForTokens(uint amountOutMin, address[] calldata path, address to, uint deadline) external payable returns (uint[] memory amounts)",
      "function swapExactTokensForETH(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)",
      "function swapExactTokensForETHSupportingFeeOnTransferTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external",
    ],
    account
  );

  const router3Interface = new Interface(UniswapV3RouterABI);
  const router3 = new ethers.Contract(PAN_ROUTER3, router3Interface, account);

  try {
    console.log(chalk.red(`\nStart Wallet tracking  ... `));

    frontSubscription.on("data", async function(transactionHash) {
      let transaction = await web3.eth.getTransaction(transactionHash);

      if (transaction != null) {
        try {
          let tx_data = await handleTransaction(
            wallet,
            customWsProvider,
            transaction,
            walletMemory
          );

          if (tx_data != null && buy_method.includes(tx_data[0])) {
            try {
              let _tokenAddress = ethers.utils.getAddress(tx_data[1][1]);

              const _amnt = tx_data[1][2];

              console.log(
                tx_data[1][0] +
                  " transaction : " +
                  transaction.hash +
                  ", method : " +
                  tx_data[0] +
                  ", amount of BNB : " +
                  _amnt +
                  "\n"
              );

              // Buy
              if (tx_data[1][0] == "buy") {
                if ((_amnt) => minbnb && _amnt <= maxbnb) {
                  // check if target transaction is between min and max.
                  var tradeAmount = parseFloat(inAmount);
                  const percentage = parseInt(percent);
                  if (percentage > 0) {
                    const balance = await customWsProvider.getBalance(wallet);
                    const EthBalance = ethers.utils.formatEther(balance);
                    const flexBalance = (parseFloat(_amnt) * percentage) / 100;

                    if (parseFloat(EthBalance) > flexBalance) {
                      tradeAmount = flexBalance;
                    } else {
                      console.log(
                        `Insufficient Balance.... Original Trading: ${_amnt}, Percent: ${percentage}, Account Balance: ${EthBalance}`
                      );
                      return;
                    }
                  }

                  if (tx_data[1][3] == "v2") {
                    await buy(
                      customWsProvider,
                      transactionHash,
                      router,
                      router3,
                      _tokenAddress,
                      wallet,
                      tradeAmount
                    );
                  } else if (tx_data[1][3] == "v3") {
                    await buyOnV3(
                      customWsProvider,
                      transactionHash,
                      router,
                      router3,
                      _tokenAddress,
                      wallet,
                      tradeAmount
                    );
                  }
                }
              } else if (tx_data[1][0] == "sell") {
                var tradeAmount = parseFloat(inAmount);
                if (tx_data[1][3] == "v2") {
                  await sell(
                    account,
                    customWsProvider,
                    router,
                    wallet,
                    _tokenAddress,
                    tradeAmount
                  );
                } else if (tx_data[1][3] == "v3") {
                  await sellOnV3(
                    account,
                    customWsProvider,
                    router3,
                    wallet,
                    _tokenAddress
                  );
                }
              }
            } catch (err) {
              console.log("buy transaction in ScanMempool....");
              console.log(err);
            }
          }
        } catch (err) {
          console.log(err);
          console.log("transaction ....");
        }
      }
    });
  } catch (err) {
    console.log(err);
    console.log(
      "Please check the network status... maybe its due because too many scan requests.."
    );
  }
}

async function parseTx(input, value) {
  if (input == "0x") {
    return ["0x", []];
  }

  let method = input.substring(0, 10);

  if ((input.length - 8 - 2) % 64 != 0) {
    // throw "Data size misaligned with parse request."
    return null;
  }

  if (buy_method.includes(method)) {
    let numParams = (input.length - 8 - 2) / 64;
    var params = [];

    // 0x7ff36ab5, 0xb6f9de95, 0xfb3bdb41 Buy functions in uniswap v2
    if (
      method == "0x7ff36ab5" ||
      method == "0xb6f9de95" ||
      method == "0xfb3bdb41"
    ) {
      for (let i = 0; i < numParams; i += 1) {
        let param;
        if (i === 0 || i === 1) {
          param = parseInt(input.substring(10 + 64 * i, 10 + 64 * (i + 1)), 16);
        } else {
          param = "0x" + input.substring(10 + 64 * i + 24, 10 + 64 * (i + 1));
        }
        params.push(param);
      }
      params[0] = "buy";
      params[1] = params[numParams - 1];
      params[2] = ethers.BigNumber.from(value) / 1000000000000000000;
      params[3] = "v2";
    } else if (method == "0x18cbafe5" || method == "0x8803dbee") {
      // Sell functions in uniswap v2
      params[0] = "sell";
      params[1] = "0x" + input.substring(418, 458);
      params[2] = 0;
      params[3] = "v2";
    } else if (method == "0x414bf389") {
      // ExactInputSingle
      const inAddr = "0x" + input.substring(34, 74);
      const outAddr = "0x" + input.substring(98, 138);
      if (ethers.utils.getAddress(inAddr) == WBNB) {
        params[0] = "buy";
        params[1] = outAddr;
        params[2] =
          ethers.BigNumber.from("0x" + input.substring(354, 394)) /
          1000000000000000000;
        params[3] = "v3";
      } else if (ethers.utils.getAddress(outAddr) == WBNB) {
        params[0] = "sell";
        params[1] = inAddr;
        params[2] =
          ethers.BigNumber.from("0x" + input.substring(354, 394)) /
          1000000000000000000;
        params[3] = "v3";
      } else {
        return null;
      }
    } else if (method == "0xac9650d8") {
      // Multicall

      const mInAddr = "0x" + input.substring(354, 394);
      const mOutAddr = "0x" + input.substring(418, 458);

      if (ethers.utils.getAddress(mOutAddr) == WBNB) {
        params[0] = "sell";
        params[1] = mInAddr;
        params[2] = 0;
        params[3] = "v3";
      } else {
        return null;
      }

      // exactInputSingle

      // exactOutputSingle
    } else if (method == "0x3593564c") {
      // execute function in uniswap universal router
      // Buy  : https://github.com/Uniswap/universal-router/blob/main/README.md
      // 0b08 : https://goerli.etherscan.io/tx/0xd4ae874e067af122a6ab9f14f2733d948aea64f8aa63fceb1a487242b38213b1
      // 0b00 : https://goerli.etherscan.io/tx/0xffc93887943f3f666c6264da0a816efe7630b5a42b59703580c96890e1e57edd
      // 0x0b000c : https://goerli.etherscan.io/tx/0x16fe5e71564ddbef9c56f3f741ea3b9a50d3f9b99ba6ffab85aefffbce1b7d53

      // Sell
      // 0x080c https://goerli.etherscan.io/tx/0x1cf1c3c6089f2cefbfcfbcdd2528ba42bb51707d7c6196f1f5751265fce3824e
      // 0x0a000c https://goerli.etherscan.io/tx/0x8a6307acbd2c467853c4492122c2a5e6dd939865ae9099adb2c727be3db36e37
      // 0x0a090c https://etherscan.io/tx/0xd1c2080e043f0be8afc041fe01c7dd99f036c21fe19443af6ab8422741f9a8ac
      // 0x0a080c https://etherscan.io/tx/0x04d181f1373dfbfcdab445d863028ca04b9587a034526072f988b330edbaec8d
      // 0x000c00 https://goerli.etherscan.io/tx/0xe9f8576917107ccdd87929aefe6e5f488707cf9ddac571ffa284a204e3ab58b5
      const methodId = input.substring(266, 272);

      let mInAddr;
      let mOutAddr;

      switch (methodId) {
        case "0b0800":
          mInAddr = "0x" + input.substring(1186, 1226); //  10 + 18*64 + 24,
          mOutAddr = "0x" + input.substring(1250, 1290); //  10 + 19*64 + 24,
          params[3] = "v2";
          break;

        case "0b0008":
          mInAddr = "0x" + input.substring(1890, 1930); //  10 + 29*64 + 24,
          mOutAddr = "0x" + input.substring(1954, 1994); //  10 + 30*64 + 24,
          params[3] = "v2";
          break;

        case "0b0000":
          mInAddr = "0x" + input.substring(1162, 1202); //  10 + 18*64, 10 + 18*64 + 40
          mOutAddr = "0x" + input.substring(1208, 1248);
          params[3] = "v3";
          break;

        case "0b000c":
          mInAddr = "0x" + input.substring(1226, 1266); //  10 + 19*64, 10 + 19*64 + 40
          mOutAddr = "0x" + input.substring(1272, 1312);
          params[3] = "v3";
          break;

        case "0b010c":
          mOutAddr = "0x" + input.substring(1226, 1266); //  10 + 19*64, 10 + 19*64 + 40
          mInAddr = "0x" + input.substring(1272, 1312);
          params[3] = "v3";
          break;

        case "0b090c":
          mInAddr = "0x" + input.substring(1250, 1290); //  10 + 18*64 + 24,
          mOutAddr = "0x" + input.substring(1314, 1354); //  10 + 19*64 + 24,
          params[3] = "v2";
          break;

        // sell

        case "010c00":
          // https://etherscan.io/tx/0x2c723dc58da5ade70aa4ed1085d8c7c0ba12f9878e8b5eebb0a8ec20a5a8054a
          mInAddr = "0x" + input.substring(1016, 1056); //  10 + 15*64, 10 + 15*64 + 40
          mOutAddr = "0x" + input.substring(970, 1010);
          params[3] = "v3";
          break;

        case "080c00":
          mInAddr = "0x" + input.substring(994, 1034); //  10 + 15*64 + 24,
          mOutAddr = "0x" + input.substring(1058, 1098); //  10 + 16*64 + 24,
          params[3] = "v2";
          break;

        case "0a000c":
          mInAddr = "0x" + input.substring(1802, 1842); //  10 + 28*64, 10 + 28*64 + 40
          mOutAddr = "0x" + input.substring(1848, 1888);
          params[3] = "v3";
          break;

        case "0a010c":
          // https://etherscan.io/tx/0x38eb68d741c344e95fecd402abd51feba9aa933ada016007ae95174f7f2fea43
          mOutAddr = "0x" + input.substring(1802, 1842); //  10 + 28*64, 10 + 28*64 + 40
          mInAddr = "0x" + input.substring(1848, 1888);
          params[3] = "v3";
          break;

        case "0a090c":
          mInAddr = "0x" + input.substring(1826, 1866); //  10 + 28*64 + 24,
          mOutAddr = "0x" + input.substring(1890, 1930); //  10 + 29*64 + 24,
          params[3] = "v2";
          break;

        case "0a080c":
          mInAddr = "0x" + input.substring(1826, 1866); //  10 + 28*64 + 24,
          mOutAddr = "0x" + input.substring(1890, 1930); //  10 + 29*64 + 24,
          params[3] = "v2";
          break;

        case "000c00":
          mInAddr = "0x" + input.substring(970, 1010); //  10 + 15*64, 10 + 15*64 + 40
          mOutAddr = "0x" + input.substring(1016, 1056);
          params[3] = "v3";
          break;

        case "090c00":
          mInAddr = "0x" + input.substring(994, 1034); //  10 + 15*64, 10 + 15*64 + 40
          mOutAddr = "0x" + input.substring(1058, 1098);
          params[3] = "v2";
          break;

        case "080000":
          mOutAddr = "0x" + input.substring(1674, 1714); //  10 + 28*64, 10 + 28*64 + 40
          mInAddr = "0x" + input.substring(1720, 1760);
          params[3] = "v3";
          break;
      }

      console.log("methodID \n");
      console.log("\n" + methodId + "\n");
      console.log(mInAddr + "\n");
      console.log(mOutAddr + "\n");

      if (ethers.utils.getAddress(mInAddr) == WBNB) {
        params[0] = "buy";
        params[1] = mOutAddr;
        params[2] = ethers.BigNumber.from(value) / 1000000000000000000;
      } else if (ethers.utils.getAddress(mOutAddr) == WBNB) {
        params[0] = "sell";
        params[1] = mInAddr;
        params[2] = 0;
      } else {
        return null;
      }
    }

    return [method, params];
  } else {
    return null;
  }
}

async function handleTransaction(wallet, provider, transaction, walletMemory) {
  var len = transaction.input.length;

  if (len < 64) return null;

  if (
    transaction != null &&
    (await isPending(provider, transaction.hash)) &&
    walletMemory.includes(transaction.from.toLowerCase()) &&
    wallet.toLowerCase() != transaction.from.toLowerCase() &&
    (ethers.utils.getAddress(transaction.to) == PAN_ROUTER ||
      ethers.utils.getAddress(transaction.to) == PAN_ROUTER3 ||
      ethers.utils.getAddress(transaction.to) == PAN_ROUTER_UINVERSAL ||
      ethers.utils.getAddress(transaction.to) == PAN_ROUTER_UINVERSAL_OLD)
  ) {
    let tx_data = await parseTx(transaction.input, transaction.value);
    return tx_data;
  } else {
    return null;
  }
}

async function isPending(provider, transactionHash) {
  return (await provider.getTransactionReceipt(transactionHash)) == null;
}

async function buyOnV3(
  provider,
  txHash,
  router2,
  router,
  tokenAddress,
  wallet,
  inAmount
) {
  try {
    console.log(
      "------------------------ donnor transaction Hash : ",
      txHash,
      wallet,
      "\n"
    );

    let _gasPrice = await provider.getGasPrice();
    let bestGasPrice = parseInt(_gasPrice) + 10000000000;

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now
    const _inAmount = Math.ceil(inAmount * 100000) / 100000;
    var amountIn = ethers.utils.parseUnits(`${_inAmount}`, "ether");

    const params = {
      tokenIn: WBNB, // ETH address
      tokenOut: ethers.utils.getAddress(tokenAddress),
      fee: 3000, // 0.3%
      recipient: wallet,
      deadline: deadline,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    console.log(
      chalk.green.inverse(
        `Buying Token
      =================
      tokenIn: ${amountIn.toString()}
      ==================
      ${tokenAddress}
    `
      )
    );

    // Call the exactInputSingle function
    const buy_tx = await router.exactInputSingle(params, {
      value: amountIn,
      gasLimit: 400000,
      gasPrice: bestGasPrice,
    });

    await buy_tx.wait();
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = provider.getTransactionReceipt(buy_tx.hash);
        console.log("wait buy transaction...");
        // await sleep(100);
      } catch (e) {
        console.log("wait buy transaction error...");
      }
    }

    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenAddress,
      action: "Detect",
      transaction: txHash,
    });

    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenAddress,
      action: "Buy",
      transaction: buy_tx.hash,
    });

    // Send the response to the frontend so let the frontend display the event.

    Object.keys(wsClients).map((client) => {
      wsClients[client].send("front updated");
    });
  } catch (err) {
    console.log(err);
    console.log(
      "Can not make transaction on V3. trying to make transaction on V2 again"
    );
   await buy(provider, txHash, router2, router, tokenAddress, wallet, inAmount);
  }
}

async function buy(
  provider,
  txHash,
  router,
  router3,
  tokenAddress,
  wallet,
  inAmount
) {
  try {
    console.log(
      "------------------------ donnor transaction Hash : ",
      txHash,
      wallet,
      "\n"
    );

    let _gasPrice = await provider.getGasPrice();
    let bestGasPrice = parseInt(_gasPrice) + 10000000000;

    const tokenIn = WBNB;
    const tokenOut = ethers.utils.getAddress(tokenAddress);

    //We buy x amount of the new token for our wbnb
    const amountIn = ethers.utils.parseUnits(`${inAmount}`, "ether");

    let amounts;
    try {
      amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
    } catch (err) {
      console.log("getAmountsOut Error on V2...... Switch to V3");
      await buyOnV3(provider, txHash, router, router3, tokenAddress, wallet, inAmount);
      return;
      // throw new Error("getAmountsOut Error");
    }

    const slippage = 30;
    const amountOutMin = amounts[1].sub(amounts[1].mul(`${slippage}`).div(100));

    let price = amountIn / amounts[1];

    //Buy token via pancakeswap v2 router

    console.log(
      chalk.green.inverse(
        `Buying Token
        =================
        tokenIn: ${amountIn.toString()} ${tokenIn} (WETH)
        ==================
        amountOutMin: ${amountOutMin.toString()} ${tokenOut}
      `
      )
    );

    const buy_tx = await router
      .swapExactETHForTokens(
        0,
        [tokenIn, tokenOut],
        wallet,
        Date.now() + 1000 * 60 * 10, //10 minutes
        {
          gasLimit: 400000,
          value: amountIn,
          gasPrice: bestGasPrice,
        }
      )
      .catch((err) => {
        console.log(err);
        console.log("buy transaction failed...");
      });

    await buy_tx.wait();
    let receipt = null;
    while (receipt === null) {
      try {
        receipt = provider.getTransactionReceipt(buy_tx.hash);
        console.log("wait buy transaction...");
        // await sleep(100);
      } catch (e) {
        console.log("wait buy transaction error...");
      }
    }

    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenOut,
      action: "Detect",
      price: price,
      transaction: txHash,
    });

    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenOut,
      action: "Buy",
      price: price,
      transaction: buy_tx.hash,
    });

    // Send the response to the frontend so let the frontend display the event.

    Object.keys(wsClients).map((client) => {
      wsClients[client].send("front updated");
    });
  } catch (err) {
    console.log(err);
    console.log(
      "Please check token balance in the Uniswap, maybe its due because insufficient balance "
    );
  }
}

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

/*****************************************************************************************************
 * Sell the token when the token price reaches a setting price.
 * ***************************************************************************************************/
async function sell(
  account,
  provider,
  router,
  wallet,
  tokenAddress,
  tradeAmount
) {
  try {
    const tokenIn = tokenAddress;
    const tokenOut = WBNB;
    const contract = new ethers.Contract(tokenIn, ERC20_ABI, account);
    //We buy x amount of the new token for our wbnb
    var amountIn = await contract.balanceOf(wallet);
    if (amountIn < 1) return;
    const amountInTrade = ethers.utils.parseUnits(`${tradeAmount}`, "ether");

    // calculate token amount based on Eth
    const amounts = await router.getAmountsOut(amountInTrade, [
      tokenOut,
      tokenIn,
    ]);

    if (parseInt(amounts[1]) < parseInt(amountIn)) {
      amountIn = amounts[1];
    }

    let _gasPrice = await provider.getGasPrice();
    let bestGasPrice = parseInt(_gasPrice) + 10000000000;

    // check if the specific token already approves, then approve that token if not.
    let allowance = await contract.allowance(wallet, PAN_ROUTER);

    if (
      allowance <
      115792089237316195423570985008687907853269984665640564039457584007913129639935
    ) {
      const tx_approve = await contract.approve(
        PAN_ROUTER,
        ethers.BigNumber.from(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        ),
        {
          gasLimit: 400000,
          gasPrice: bestGasPrice,
        }
      );
      if (tx_approve == null) return;
      await tx_approve.wait();
      console.log(tokenIn, " Approved \n");
    }

    // let price = amounts[1] / amountIn;

    console.log(
      chalk.green.inverse(`\nSell tokens: V2 \n`) +
        `================= ${tokenIn} ===============${amountIn}`
    );

    const tx_sell = await router
      .swapExactTokensForETHSupportingFeeOnTransferTokens(
        amountIn,
        0,
        [tokenIn, tokenOut],
        wallet,
        Date.now() + 1000 * 60 * 10, //10 minutes
        {
          gasLimit: 400000,
          gasPrice: bestGasPrice,
        }
      )
      .catch((err) => {
        console.log("sell transaction failed...");
        return;
      });

    if (tx_sell == null) return;
    await tx_sell.wait();

    let receipt = null;
    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(tx_sell.hash);
      } catch (e) {
        console.log(e);
      }
    }
    console.log("Token is sold successfully...");

    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenIn,
      action: "Sell",
      transaction: tx_sell.hash,
    });

    // Send the response to the frontend so let the frontend display the event.

    Object.keys(wsClients).map((client) => {
      wsClients[client].send("front updated");
    });
  } catch (err) {
    console.log(err);
    console.log(
      "Please check token BNB/WBNB balance in the pancakeswap, maybe its due because insufficient balance "
    );
  }
}

async function sellOnV3(account, provider, router, wallet, tokenAddress) {
  try {
    const tokenIn = tokenAddress;
    const tokenOut = WBNB;
    const contract = new ethers.Contract(tokenIn, ERC20_ABI, account);
    //We buy x amount of the new token for our wbnb
    const amountIn = await contract.balanceOf(wallet);

    const decimal = await contract.decimals();
    if (amountIn < 1) return;

    // check if the specific token already approves, then approve that token if not.
    let amount = await contract.allowance(wallet, PAN_ROUTER3);

    let _gasPrice = await provider.getGasPrice();
    let bestGasPrice = parseInt(_gasPrice) + 10000000000;

    if (
      amount <
      115792089237316195423570985008687907853269984665640564039457584007913129639935
    ) {
      const tx_approve = await contract.approve(
        PAN_ROUTER3,
        ethers.BigNumber.from(
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        ),
        {
          gasLimit: 400000,
          gasPrice: bestGasPrice,
        }
      );
      if (tx_approve == null) return;
      await tx_approve.wait();
      console.log(tokenIn, " Approved \n");
    }

    console.log(
      chalk.green.inverse(`\nSell tokens: \n`) +
        `================= ${tokenIn} ===============`
    );
    console.log(chalk.yellow(`decimals: ${decimal}`));

    const deadline = Math.floor(Date.now() / 1000) + 60 * 10; // 10 minutes from now

    const params = {
      tokenIn: tokenIn, // ETH address
      tokenOut: tokenOut,
      fee: 3000, // 0.3%
      recipient: wallet,
      deadline: deadline,
      amountIn: amountIn,
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0,
    };

    // Call the exactInputSingle function
    const tx_sell = await router.exactInputSingle(params, {
      gasLimit: 400000,
      gasPrice: bestGasPrice,
    });

    if (tx_sell == null) return;
    await tx_sell.wait();

    let receipt = null;
    while (receipt === null) {
      try {
        receipt = await provider.getTransactionReceipt(tx_sell.hash);
      } catch (e) {
        console.log(e);
      }
    }

    const WETHContract = new ethers.Contract(WBNB, WETHABI, account);
    const WETHBalance = await WETHContract.balanceOf(wallet);
    if (WETHBalance > 1) {
      await WETHContract.withdraw(WETHBalance);
    }

    console.log("Token is sold successfully...");

    FrontDetail.create({
      timestamp: new Date().toISOString(),
      token: tokenIn,
      action: "Sell",
      transaction: tx_sell.hash,
    });

    // Send the response to the frontend so let the frontend display the event

    Object.keys(wsClients).map((client) => {
      wsClients[client].send("front updated");
    });
  } catch (err) {
    console.log(err);
    console.log(
      "Please check token BNB/WBNB balance, maybe its due because insufficient balance "
    );
  }
}

module.exports = {
  scanMempool: scanMempool,
};
