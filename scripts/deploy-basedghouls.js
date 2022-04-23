const { ethers, upgrades } = require('hardhat');

async function main () {
    const BasedGhouls = await ethers.getContractFactory('BasedGhouls');
    console.log('Deploying BasedGhouls...');
    const ghls = await upgrades.deployProxy(BasedGhouls);
    await ghls.deployed();
    console.log('ghls deployed to:', ghls.address);
  }
  
  main();

//   async function upgrade() {
//       const BasedGhoulsUpgrade = await ethers.getContractFactory("BasedGhoulsv2");
//       console.log("Upgrading Based Ghouls");
//       const ghls = await upgrades.upgradeProxy("0x46FC850b1Dee2cfeef8e9ea24E3d706313398BD4", BasedGhoulsUpgrade);
//   }

//   upgrade();