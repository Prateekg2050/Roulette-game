const web3 = require("@solana/web3.js");
const { getWalletBalance, transferSOL, airDropSol } = require("./solana");
const { randomNumber, totalAmtToBePaid, getReturnAmount } = require("./helper");
const prompt = require("prompt-sync")({ sigint: true });

// const userWallet = web3.Keypair.generate();
// console.log(userWallet);

//user wallet

let userpubkey = [
  28, 112, 212, 220, 16, 203, 177, 138, 116, 245, 247, 78, 18, 52, 10, 156, 193,
  189, 205, 44, 173, 212, 21, 211, 43, 243, 91, 155, 122, 134, 42, 30,
];

let userpvtkey = [
  203, 188, 180, 34, 137, 237, 160, 94, 164, 141, 169, 135, 235, 93, 225, 178,
  111, 173, 87, 197, 105, 138, 103, 166, 147, 217, 91, 0, 255, 75, 94, 3, 28,
  112, 212, 220, 16, 203, 177, 138, 116, 245, 247, 78, 18, 52, 10, 156, 193,
  189, 205, 44, 173, 212, 21, 211, 43, 243, 91, 155, 122, 134, 42, 30,
];

const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userpvtkey));

//transfer wallet

let tpubkey = [
  224, 93, 64, 61, 132, 20, 33, 184, 195, 125, 92, 28, 159, 109, 67, 80, 136,
  84, 133, 89, 222, 115, 164, 210, 164, 168, 97, 175, 160, 217, 65, 77,
];

let tpvtkey = [
  135, 114, 65, 103, 89, 5, 84, 10, 101, 176, 10, 116, 146, 214, 26, 136, 5,
  122, 162, 137, 5, 0, 198, 184, 20, 91, 253, 236, 235, 235, 154, 222, 224, 93,
  64, 61, 132, 20, 33, 184, 195, 125, 92, 28, 159, 109, 67, 80, 136, 84, 133,
  89, 222, 115, 164, 210, 164, 168, 97, 175, 160, 217, 65, 77,
];
const transferWallet = web3.Keypair.fromSecretKey(Uint8Array.from(tpvtkey));

const game = async () => {
  console.log("The maximum amount is 2.5 SOL.");

  const stakeAmt = prompt("What is the amount of SOL you want to stake? ");

  const ratio = prompt("What is the ratio of your staking? ");

  const paymentAmt = totalAmtToBePaid(
    stakeAmt,
    parseFloat(ratio.split(":")[0])
  );

  const returnAmt = getReturnAmount(stakeAmt, parseFloat(ratio.split(":")[1]));

  const no = prompt("Guess a random number from 1 to 5 (both included) ");

  const paymentSign = await transferSOL({
    from: userWallet,
    to: transferWallet,
    transferAmount: paymentAmt,
  });

  console.log(`Signature of payment for playing the game ${paymentSign}`);

  if (randomNumber(1, 5) == no) {
    console.log("Your guess is absoluetly correct.");

    const returnSign = await transferSOL({
      from: transferWallet,
      to: userWallet,
      transferAmount: returnAmt,
    });

    console.log(`Here is the price signature ${returnSign}`);
  } else {
    console.log("Better Luck next time.");
    console.log("Current wallet balace ");
    await getWalletBalance(userWallet.publicKey);
  }
};

game();

helpFunction = async () => {
  await getWalletBalance(userWallet.publicKey);
  await airDropSol(userWallet.publicKey);
  await getWalletBalance(userWallet.publicKey);
};

// helpFunction();
