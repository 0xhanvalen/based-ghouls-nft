const { ethers, upgrades } = require('hardhat');

async function main() {
    const BasedGhouls = await ethers.getContractFactory('BasedGhouls');
    console.log('Deploying BasedGhouls...');
    const ghlsProxy = await upgrades.forceImport("0x938e5ed128458139A9c3306aCE87C60BCBA9c067", BasedGhouls, {kind: 'transparent'});
    console.log(ghlsProxy);
    // const ghls = await upgrades.deployProxy(BasedGhouls);
    // await ghls.deployed();
    // console.log('ghls deployed to:', ghls.address);
}

main();