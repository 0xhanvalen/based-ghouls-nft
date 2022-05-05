const { expect } = require("chai");
const { ethers, upgrades } = require("hardhat");

describe("GHLS", async function () {
  let BGToken;
  let BRToken;
  let BGHLS;
  let BR;
  let owner;
  let minter;

  const userProof = [
    "0x2b0db89b0df4bd5c6fab0130644eb5a46615ae80503268465dac278580eb409c",
    "0xf494e313e50a8bd980f582764ffdbf0b31e754d158cb6b570ce03e1d1f75f67e",
    "0x057e5f8985b13b590f4f33b09bab7a13635115fd01df99e858c26d6aca0567f9",
    "0x1c6bbc58f985b30bd574802a056965177fe44c2c119e14293e813aa59e34835f",
    "0x2f207fc98e67c4a4fdeae4a5e75203c70eb0255e526f8e4e975678cb3cfa6b14",
    "0x973dcd4023bbf4ed3451d05b13605b09004166519f039b3a9e3a9224d161e9a6",
    "0xe0244046b522e75e82c04ab8293351a7e3625675acbd483e12e97490ea546a38",
    "0x0d9c45f9b8bda600113373e3c5247d86d3eb297e90085bdc7a058b6d9223b30d",
    "0xb94fbe40b3bd85d8067eb30cbbfcbfa9d63095b1e7065f0e3afb536e173a4a69",
    "0xd46e737da1de2b550760f52964f4cf7188b138a466944a731a4a529bb37b8a66",
    "0xbccadbd0261b7eb13cdf3f0b5fbbb55463a61ad444c3891e3c87f7b649d68d7b",
    "0x5f858aa295bac1f9d53b33e79794a5339be04e9e2edd2bf6482dcec31fed248b",
    "0x88d67ad2d1b1caebfaa01bb4a017207560dca215a390fdec6eaef78cf8b727c5",
    "0x599701d3876ef9c57084cb027f6d75cf4f9f7b2bff5c79aee1351ff5eb442b2d",
  ];


  beforeEach(async function () {
    BGToken = await ethers.getContractFactory("BasedGhoulsv269");
    BRToken = await ethers.getContractFactory("BatchReveal");
    [owner, minter] = await ethers.getSigners();
    BGHLS = await upgrades.deployProxy(BGToken);
    BR = await upgrades.deployProxy(BRToken);
    await BGHLS.deployed();
    await BR.deployed();
    console.log("ghls deployed to:", BGHLS.address);
    console.log("br deployed to:", BR.address);
    await BR.grantRole(BR.DEFAULT_ADMIN_ROLE(), BGHLS.address);
    await BGHLS.setShufflerAddress(BR.address);
    await BGHLS.setMintability(true);
    await BGHLS.releaseTheHorde(true);
  });

  it("Should be named", async () => {
    expect(await BGHLS.name()).to.exist;
  });

  it("Should have set the BR address", async () => {
    const BGHLSShufflerAddress = await BGHLS.shufflerAddress();
    expect(BGHLSShufflerAddress).to.equal(BR.address);
  });

  it("Should mint", async () => {
    await expect(BGHLS.summon(userProof, false)).to.not.be.reverted;
  });
  
  it("Should Mint 66 or more Ghouls", async () => {
      await BGHLS.connect(minter);
      for (i = 0; i < 263; i++) {
          await BGHLS.summon(userProof, false);
      }
      console.log(await BGHLS.summon(userProof, false));
    //   await expect(BGHLS.summon(userProof, false)).to.not.be.reverted;
      // dudnae shuffle
      console.log(await BGHLS.tokenURI(4));
      console.log(await BGHLS.tokenURI(264));
      expect(await BGHLS.tokenURI(69)).to.not.equal("https://ghlsprereveal.s3.amazonaws.com/json/Shallow_Grave.json");
  });



// deeze don't work when 1/1 allowlist is on
  // it("Should Mint", async () => {
  //     await BGHLS.connect(minter);
  //     await expect(BGHLS.mint()).to.not.be.reverted;
  // })


});
