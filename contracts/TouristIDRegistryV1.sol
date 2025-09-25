// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";

contract TouristIDRegistryV1 is Initializable, OwnableUpgradeable, UUPSUpgradeable {
    using ECDSAUpgradeable for bytes32;

    struct TouristID {
        string name;
        uint256 dob; // unix timestamp
        string ipfsHash; // metadata stored on IPFS
        bool exists;
    }

    mapping(address => TouristID) private _registry;
    event IDRegistered(address indexed who, string name, uint256 dob, string ipfsHash);
    event IDUpdated(address indexed who, string name, uint256 dob, string ipfsHash);

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address admin) public initializer {
        __Ownable_init();
        __UUPSUpgradeable_init();
        if (admin != address(0)) {
            transferOwnership(admin);
        }
    }

    function registerID(address who, string calldata name, uint256 dob, string calldata ipfsHash) external onlyOwner {
        require(!_registry[who].exists, "Already registered");
        _registry[who] = TouristID({name: name, dob: dob, ipfsHash: ipfsHash, exists: true});
        emit IDRegistered(who, name, dob, ipfsHash);
    }

    function updateID(address who, string calldata name, uint256 dob, string calldata ipfsHash) external onlyOwner {
        require(_registry[who].exists, "Not registered");
        _registry[who] = TouristID({name: name, dob: dob, ipfsHash: ipfsHash, exists: true});
        emit IDUpdated(who, name, dob, ipfsHash);
    }

    function getID(address who) external view returns (string memory name, uint256 dob, string memory ipfsHash, bool exists) {
        TouristID memory t = _registry[who];
        return (t.name, t.dob, t.ipfsHash, t.exists);
    }

    // UUPS authorization
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
}
