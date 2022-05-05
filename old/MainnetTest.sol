//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";


contract TestCoin is ERC20Upgradeable, OwnableUpgradeable {


    function initialize() initializer public {
        __ERC20_init("TestCoin", "TSC");
        _mint(msg.sender, 10 ether);
    }
}