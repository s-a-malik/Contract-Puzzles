const { assert } = require("chai");

describe("Game5", function() {
  it("should be a winner", async function() {
    const Game = await ethers.getContractFactory("Game5");
    const game = await Game.deploy();
    await game.deployed();

    // good luck
    // make a signer which is below the threshold and use it to call the contract

    // in hardhat, 20 accounts are created with 10000 ETH each by default, can change this in 
    // the config file.
    // console.log(await ethers.provider.listAccounts());

    // create random wallets in ethers until the public key is below the threshold
    let wallet; 
    let address;
    let foundWallet = false;
    while(!foundWallet) {
      wallet = ethers.Wallet.createRandom();
      address = await wallet.getAddress();
      if (BigInt(address) < BigInt(0x00FfFFfFFFfFFFFFfFfFfffFFFfffFfFffFfFFFf) ) {
        foundWallet = true;
        console.log("Wallet under threshold at: " + address);
      }
    }

    // Connect this new wallet to hardhats provider
    wallet = wallet.connect(ethers.provider);


    // Send some eth to the wallet for gas
    const signer = ethers.provider.getSigner(0);
    await signer.sendTransaction({to: address, value: ethers.utils.parseEther("1")});

    // win the game with the new wallet
    await game.connect(wallet).win();

    // leave this assertion as-is
    assert(await game.isWon(), "You did not win the game");
  });
});
