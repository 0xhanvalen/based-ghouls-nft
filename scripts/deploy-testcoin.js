const { ethers, upgrades } = require('hardhat');


async function main () {
    const TestCoin = await ethers.getContractFactory('TestCoin');
    console.log('Deploying TestCoin...');
    const tsc = await upgrades.deployProxy(TestCoin);
    await tsc.deployed();
    console.log('tsc deployed to:', tsc.address);
  }
  
  main();
