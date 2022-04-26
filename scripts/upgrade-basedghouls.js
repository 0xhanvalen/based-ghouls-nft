const { ethers, upgrades } = require('hardhat');

// async function main () {
//     const BasedGhouls = await ethers.getContractFactory('BasedGhouls');
//     console.log('Deploying BasedGhouls...');
//     const ghls = await upgrades.deployProxy(BasedGhouls);
//     await ghls.deployed();
//     console.log('ghls deployed to:', ghls.address);
//   }
  
//   main();

  async function main() {
      const BasedGhoulsUpgrade = await ethers.getContractFactory("BasedGhoulsv2");
      console.log("Upgrading Based Ghouls");
      const ghls = await upgrades.upgradeProxy("0x938e5ed128458139A9c3306aCE87C60BCBA9c067", BasedGhoulsUpgrade);
      await ghls.deployed();
  }

  main();