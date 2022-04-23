const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("GHLS", function () {
    let Token;
    let BGHLS;
    let owner;
    let minter;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("BasedGhouls");
        [owner, minter] = await ethers.getSigners();
        BGHLS = await upgrades.deployProxy(Token);
        await BGHLS.deployed();
        console.log('ghls deployed to:', BGHLS.address);
        await BGHLS.setMintability(true);
      });

    it("Should be named", async () => {
        expect(await BGHLS.name()).to.exist;
    });

        // deeze don't work when 1/1 allowlist is on
    // it("Should Mint", async () => {
    //     await BGHLS.connect(minter);
    //     await expect(BGHLS.mint()).to.not.be.reverted;
    // })



    // it("Should Mint 66 or more Ghouls", async () => {
    //     await BGHLS.connect(minter);
    //     for (i = 0; i < 69; i++) {
    //         await BGHLS.mint();
    //     }
    //     await expect(BGHLS.mint()).to.not.be.reverted;
    // });

    // it("Should return the index after weeeee", async () => {
    //     await BGHLS.connect(minter);
    //     for (i = 0; i < 69; i++) {
    //         await BGHLS.mint();
    //     }
    //     console.log(await BGHLS.tokenURI(4));
    //     expect(await BGHLS.tokenURI(4)).to.not.equal("https://ghlsprereveal.s3.amazonaws.com/json/Shallow_Grave.json");
    // });
})