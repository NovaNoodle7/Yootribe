const { ERC20_ABI, WBNB, PAN_ROUTER } = require("../constant/erc20");
const { SnippingDetail } = require("../models");
const ethers = require("ethers");
const chalk = require("chalk");
const Web3 = require("web3");
const app = require("../app.js");

/*****************************************************************************************************
 * Find the new liquidity Pair with specific token while scanning the mempool in real-time.
 * ***************************************************************************************************/
async function scanMempool(
  node,
  wallet,
  key,
  tokenAddress,
  inAmount,
  slippage,
  gasPrice,
  gasLimit
) {
  var web3 = new Web3(new Web3.providers.WebsocketProvider(node));
  snipSubscription = web3.eth.subscribe("pendingTransactions", function(
    error,
    result
  ) {});
  var customWsProvider = new ethers.providers.WebSocketProvider(node);
  var ethWallet = new ethers.Wallet(key);
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

  try { 
    console.log(
      chalk.red(`\nStart New Liqudity Pair added detect Service Start ... `)
    );
    snipSubscription.on("data", (tx) => {
      customWsProvider.getTransaction(tx).then(async function(transaction) {
        
        if (transaction != null) {
          console.log(transaction.hash);
          try {
            txData = transaction.data;
            txFunc = txData.substring(0, 10);
            lpAddress = "0x" + txData.substring(10, 74).replace(/^0+/, "");
            if (
              txFunc == "0xf305d719" ||
              txFunc == "0xe8e33700" ||
              txFunc == "0x0d295980" ||
              txFunc == "0xc9567bf9" ||
              txFunc == "0xe8078d94"
            ) {
              if (tokenAddress.toLowerCase() == lpAddress.toLowerCase()) {
                try {
                  console.log("addLiquidity: " + transaction.hash);
                  await buy(
                    customWsProvider,
                    wallet,
                    transaction,
                    router,
                    lpAddress,
                    inAmount,
                    slippage,
                    gasPrice,
                    gasLimit
                  );
                } catch (err) {
                  console.log("buy transaction in ScanMempool....");
                  console.log(err);
                  await buy(
                    customWsProvider,
                    wallet,
                    transaction,
                    router,
                    lpAddress,
                    inAmount,
                    slippage,
                    gasPrice,
                    gasLimit
                  );
                }
              }
            }
          } catch (err) {
            console.log("transaction ....");
          }
        }
      });
    });

  } catch (err) {
    console.log(err);
    console.log(
      "Please check the network status... maybe its due because too many scan requests.."
    );
  }
}

async function buy(
  provider,
  wallet,
  transaction,
  router,
  lpAddress,
  inAmount,
  slippage,
  gasPrice,
  gasLimit
) {
  console.log(chalk.green(`Buy token .........`));
  console.log(chalk.red(`New Add liquidity address :  ${lpAddress}`));
  console.log(
    "------------------------ Add Liqudity transaction Hash : ",
    transaction.hash
  );

  let liqTrans = null;
  while (liqTrans == null) {
    try {
      liqTrans = await provider.getTransactionReceipt(transaction.hash);
      console.log("wait...");
    } catch (e) {
      // console.log(e)
    }
  }
  const tokenIn = WBNB;
  const tokenOut = ethers.utils.getAddress(lpAddress);

  //We buy x amount of the new token for our wbnb
  const amountIn = ethers.utils.parseUnits(`${inAmount}`, "ether");
  console.log("amountIn", amountIn);
  console.log(amountIn, WBNB, tokenOut);

  let amounts;
  try {
    amounts = await router.getAmountsOut(amountIn, [tokenIn, tokenOut]);
  } catch (err) {
    console.log("getAmountsOut Error......");
    throw new Error("getAmountsOut Error");
  }

  //Our execution price will be a bit different, we need some flexbility
  const amountOutMin = amounts[1].sub(amounts[1].mul(`${slippage}`).div(100));
  //const amountOutMin = amounts[1].sub(amounts[1].div(`${data.Slippage}`));
  console.log("slippage", amountOutMin, amounts[1]);

  console.log(
    chalk.green.inverse(`Liquidity Addition Detected\n`) +
      `Buying Token
            =================
            tokenIn: ${amountIn.toString()} ${tokenIn} (WBNB)
            tokenOut: ${amountOutMin.toString()} ${tokenOut}
          `
  );

  let price = amountIn / amounts[1];

  //Buy token via pancakeswap v2 router.
  // const buy_tx = await router
  //   .swapExactETHForTokens(
  //     amountOutMin,
  //     [tokenIn, tokenOut],
  //     wallet,
  //     Date.now() + 1000 * 60 * 10, //10 minutes
  //     {
  //       gasLimit: gasLimit,
  //       gasPrice: ethers.utils.parseUnits(`${gasPrice}`, "gwei"),
  //       value: amountIn,
  //     }
  //   )
  //   .catch((err) => {
  //     console.log(err);
  //     console.log("transaction failed...");
  //   });


  //Buy token via pancakeswap v2 router.
  const buy_tx = await router
  .swapExactTokensForTokens(
    amountIn,
    0,
    [tokenIn, tokenOut],
    wallet,
    Date.now() + 1000 * 60 * 10, //10 minutes
    {
      gasLimit: gasLimit,
      gasPrice: ethers.utils.parseUnits(`${gasPrice}`, "gwei")
    }
  )
  .catch((err) => {
    console.log(err);
    console.log("transaction failed...");
  });


  // await buy_tx.wait();
  let receipt = null;
  while (receipt == null) {
    try {
      receipt = await provider.getTransactionReceipt(buy_tx.hash);
    } catch (e) {
      // console.log(e)
    }
  }

  SnippingDetail.create({
    timestamp: new Date().toISOString(),
    token: tokenOut,
    action: "Detect",
    price: price,
    transaction: transaction.hash,
  });

  SnippingDetail.create({
    timestamp: new Date().toISOString(),
    token: tokenOut,
    action: "Buy",
    price: price,
    transaction: buy_tx.hash,
  });

  // Send the response to the frontend so let the frontend display the event.

  var aWss = app.wss.getWss("/");
  aWss.clients.forEach(function(client) {
    var detectObj = {
      type: "snipping",
      token: tokenOut,
      action: "Detected",
      price: price,
      timestamp: new Date().toISOString(),
      transaction: transaction.hash,
    };
    var detectInfo = JSON.stringify(detectObj);

    var obj = {
      type: "snipping",
      token: tokenOut,
      action: "Buy",
      price: price,
      timestamp: new Date().toISOString(),
      transaction: buy_tx.hash,
    };
    var updateInfo = JSON.stringify(obj);

    // client.send(detectInfo);
    // client.send(updateInfo);
    client.send("snipping update");
  });
}

function exponentialToDecimal(exponential) {
  let decimal = exponential.toString().toLowerCase();
  if (decimal.includes("e+")) {
    const exponentialSplitted = decimal.split("e+");
    let postfix = "";
    for (
      let i = 0;
      i <
      +exponentialSplitted[1] -
        (exponentialSplitted[0].includes(".")
          ? exponentialSplitted[0].split(".")[1].length
          : 0);
      i++
    ) {
      postfix += "0";
    }
    const addCommas = (text) => {
      let j = 3;
      let textLength = text.length;
      while (j < textLength) {
        text = `${text.slice(0, textLength - j)},${text.slice(
          textLength - j,
          textLength
        )}`;
        textLength++;
        j += 3 + 1;
      }
      return text;
    };
    decimal = addCommas(exponentialSplitted[0].replace(".", "") + postfix);
  }
  if (decimal.toLowerCase().includes("e-")) {
    const exponentialSplitted = decimal.split("e-");
    let prefix = "0.";
    for (let i = 0; i < +exponentialSplitted[1] - 1; i++) {
      prefix += "0";
    }
    decimal = prefix + exponentialSplitted[0].replace(".", "");
  }
  return decimal;
}

module.exports = {
  scanMempool: scanMempool,
};
