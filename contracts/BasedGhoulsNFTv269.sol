//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/MerkleProofUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/StringsUpgradeable.sol";

import "./interfaces/IBatchReveal.sol";

import "hardhat/console.sol";

// ghouls rebased by @0xhanvalen

contract BasedGhoulsv269 is ERC721Upgradeable, ERC2981Upgradeable, AccessControlUpgradeable {
    using StringsUpgradeable for uint256;

    mapping (address => bool) public EXPANSIONPAKRedemption;
    mapping (address => bool) public REBASERedemption;

    bool public isMintable;
    uint16 public totalSupply;
    uint16 public maxGhouls;
    uint16 public summonedGhouls;
    uint16 public rebasedGhouls;
    uint16 public maxRebasedGhouls;
    uint16 public lastTokenRevealed;
    uint16 public TOKEN_LIMIT;
    uint16 public REVEAL_BATCH_SIZE;

    string public baseURI;
    string public unrevealedURI;

    bytes32 public EXPANSION_PAK;
    bytes32 public SUMMONER_LIST;

    address public shufflerAddress;

    function initialize() initializer public {
        __ERC721_init("Based Ghouls", "GHLS");
        maxGhouls = 6666;
        maxRebasedGhouls = 2397;
        baseURI = "https://ghlstest.s3.amazonaws.com/json/";
        unrevealedURI = "https://ghlsprereveal.s3.amazonaws.com/json/Shallow_Grave.json";
        EXPANSION_PAK = 0xeaad81dc1fbbd6832eacc1a6445f0220959cd68597f0e7a6b1270b2bb16cf31d;
        SUMMONER_LIST = 0x10baa072ec97e81b0f088ddba9053c59cef96ef754e8ab542304e13c9c7b360e;
        lastTokenRevealed = 1;
        TOKEN_LIMIT = 264;
        REVEAL_BATCH_SIZE = 66;
        isMintable = false;
        totalSupply = 0;
        _setDefaultRoyalty(0x475dcAA08A69fA462790F42DB4D3bbA1563cb474, 690);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        grantRole(DEFAULT_ADMIN_ROLE, 0x98CCf605c43A0bF9D6795C3cf3b5fEd836330511);
    }

    function updateBaseURI(string calldata _newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        baseURI = _newURI;
    }

    function updateUnrevealedURI(string calldata _newURI) public onlyRole(DEFAULT_ADMIN_ROLE) {
        unrevealedURI = _newURI;
    }
 
    function setMintability(bool _mintability) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isMintable = _mintability;
    }

    function setShufflerAddress(address _address) public onlyRole(DEFAULT_ADMIN_ROLE) {
        shufflerAddress = _address;
    }

    function setBatchSeed(uint _randomness) private {
        console.log("I'M BATCH SEEDING");
        IBatchReveal(shufflerAddress).setBatchSeed(_randomness);
    }

    function setLastTokenRevealed(uint16 _index) private {
        IBatchReveal(shufflerAddress).setLastTokenRevealed(_index);
    }

    function getShuffledTokenId(uint _startId) view private returns (uint) {
        console.log("IM SHUFFLING");
        return IBatchReveal(shufflerAddress).getShuffledTokenId(_startId);
    }

    // u gotta... GOTTA... send the merkleproof in w the mint request. 
    function summon(bytes32[] calldata _merkleProof, bool _isRebase) public {
        require(isMintable, "NYM");
        require(totalSupply <= maxGhouls, "OOG");
        address minter = msg.sender;
        require(tx.origin == msg.sender, "NSCM");
        if (_isRebase) {
            require(!REBASERedemption[minter], "TMG");
            require(!EXPANSIONPAKRedemption[minter], "TMG");
            require(rebasedGhouls + 3 <= maxRebasedGhouls, "NEG");
            bytes32 leaf = keccak256(abi.encodePacked(minter));
            bool isLeaf = MerkleProofUpgradeable.verify(_merkleProof, SUMMONER_LIST, leaf);
            require(isLeaf, "NBG");
            REBASERedemption[minter] = true;
            EXPANSIONPAKRedemption[minter] = true;
            totalSupply = totalSupply + 3;
            rebasedGhouls += 3;
            _mint(minter, totalSupply - 3);
            _mint(minter, totalSupply - 2);
            _mint(minter, totalSupply - 1);
        }
        if (!isHordeReleased && !_isRebase) {
                require(!EXPANSIONPAKRedemption[minter], "TMG");
                require(summonedGhouls + 1 + maxRebasedGhouls <= maxGhouls, "NEG");
                bytes32 leaf = keccak256(abi.encodePacked(minter));
                bool isLeaf = MerkleProofUpgradeable.verify(_merkleProof, EXPANSION_PAK, leaf);
                require(isLeaf, "NBG");
                EXPANSIONPAKRedemption[minter] = true;
                totalSupply = totalSupply + 1;
                summonedGhouls += 1;
                _mint(minter, totalSupply - 1);
        }
        if (isHordeReleased) {
            // require(summonedGhouls + 1 + maxRebasedGhouls <= maxGhouls, "NEG");
            summonedGhouls += 1;
            totalSupply = totalSupply + 1;
            _mint(minter, totalSupply - 1);
        }
        console.log("LAST TOKEN Minted: ", totalSupply);
        console.log("LAST TOKEN REVEALED: ", lastTokenRevealed);
        if(totalSupply >= (lastTokenRevealed + REVEAL_BATCH_SIZE)) {
            lastTokenRevealed = totalSupply;
            setLastTokenRevealed(totalSupply);
            uint256 seed;
            unchecked {
                seed = uint256(blockhash(block.number - 69)) * uint256(block.timestamp % 69);
            }
            setBatchSeed(seed);
        }
    }

    function tokenURI(uint256 id) public view override returns (string memory) {
        if(id >= lastTokenRevealed){
            return unrevealedURI;
        } else {
             return string(abi.encodePacked(baseURI, getShuffledTokenId(id).toString(), ".json"));
        }
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(AccessControlUpgradeable, ERC2981Upgradeable, ERC721Upgradeable) returns (bool) {
        return
            interfaceId == type(IERC721Upgradeable).interfaceId ||
            interfaceId == type(IERC721MetadataUpgradeable).interfaceId ||
            interfaceId == type(IAccessControlUpgradeable).interfaceId ||
            interfaceId == type(IERC2981Upgradeable).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    bool public isHordeReleased;

    function insertExpansionPack(bytes32 _newMerkle) public onlyRole(DEFAULT_ADMIN_ROLE) {
        EXPANSION_PAK = _newMerkle;   
    }

    function releaseTheHorde(bool _isHordeReleased) public onlyRole(DEFAULT_ADMIN_ROLE) {
        isHordeReleased = _isHordeReleased;
    }

    function insertRebasePack(bytes32 _newMerkle, uint16 _maxRebasedGhouls) public onlyRole(DEFAULT_ADMIN_ROLE) {
        SUMMONER_LIST = _newMerkle;   
        maxRebasedGhouls = _maxRebasedGhouls;
    }
}
