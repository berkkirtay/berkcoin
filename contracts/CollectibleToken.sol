// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// I used a similar approach that ERC721 token has but I didn't
// exactly inherited it to my implementation since this token won't
// be used in a production environment.

contract CollectibleToken {
    struct Collectible {
        string tokenURI;
        address creator;
        address ownerAddress;
        bytes32 collectibleHash;
        string collectibleDescription;
        uint256 lastTokenPrice;
    }

    uint256 public tokenCounter;
    uint256 public transactionFee;

    mapping(uint256 => Collectible) public collectibles;
    mapping(uint256 => address) public collectibleOwners;
    mapping(string => uint256) public collectibleURIs;
    mapping(uint256 => bool) public availableToTradeCollectibles;
    mapping(uint256 => bool) public burnedCollectibles;

    //ERC721("berkcoin", "BERK")
    constructor() {
        tokenCounter = 1;
        transactionFee = 10000;
    }

    function createNewCollectible(
        string memory tokenURI,
        string memory description,
        uint256 price,
        address owner,
        bool isAvailableToTrade
    ) public {
        require(collectibleURIs[tokenURI] == 0, "Token URI is already owned!");

        bytes32 computedHash = calculateCollectibleHash(
            tokenURI,
            description,
            price,
            owner
        );
        collectibles[tokenCounter] = Collectible(
            tokenURI,
            owner,
            owner,
            computedHash,
            description,
            price
        );
        availableToTradeCollectibles[tokenCounter] = isAvailableToTrade;
        collectibleURIs[tokenURI] = tokenCounter;
        collectibleOwners[tokenCounter++] = owner;

        emit NewCollectible(owner, tokenCounter - 1);
    }

    function calculateCollectibleHash(
        string memory tokenURI,
        string memory description,
        uint256 price,
        address owner
    ) private view returns (bytes32) {
        return
            keccak256(
                abi.encodePacked(
                    tokenURI,
                    owner,
                    description,
                    price,
                    tokenCounter
                )
            );
    }

    function transferCollectible(address to, uint256 tokenID) public {
        address oldOwner = collectibleOwners[tokenID];
        collectibleOwners[tokenID] = to;
        collectibles[tokenID].ownerAddress = to;

        emit CollectibleTransfer(oldOwner, to, tokenID);
    }

    function burnCollectible(uint256 tokenID, address sender) public {
        require(
            collectibles[tokenID].ownerAddress == sender,
            "Sender must be the owner of the collectibe!"
        );
        collectibleURIs[collectibles[tokenID].tokenURI] = 0;
        collectibleOwners[tokenID] = address(0);
        burnedCollectibles[tokenID] = true;
    }

    function setPriceOfCollectible(
        address owner,
        uint256 tokenID,
        uint256 price
    ) public {
        require(
            collectibleOwners[tokenID] == owner,
            "Sender doesn't own the collectible!"
        );
        collectibles[tokenID].lastTokenPrice = price;

        emit NewCollectiblePrice(tokenID, price);
    }

    function setAvailabilityOfCollectible(
        address owner,
        uint256 tokenID,
        bool availability
    ) public {
        require(
            collectibleOwners[tokenID] == owner,
            "Sender doesn't own the collectible!"
        );
        availableToTradeCollectibles[tokenID] = availability;

        emit NewAvailabilityStatus(tokenID, availability);
    }

    // View Collectible Info

    // The burned collectibles will have an address of 0x0..
    function getAccessibility(uint256 tokenID) public view returns (bool) {
        return !burnedCollectibles[tokenID];
    }

    function getTokenURI(uint256 tokenID) public view returns (string memory) {
        return collectibles[tokenID].tokenURI;
    }

    function getTokenCreator(uint256 tokenID) public view returns (address) {
        return collectibles[tokenID].creator;
    }

    function getTokenOwner(uint256 tokenID) public view returns (address) {
        return collectibleOwners[tokenID];
    }

    function getTokenHash(uint256 tokenID) public view returns (bytes32) {
        return collectibles[tokenID].collectibleHash;
    }

    function getTokenDescription(uint256 tokenID)
        public
        view
        returns (string memory)
    {
        return collectibles[tokenID].collectibleDescription;
    }

    function getPriceOfCollectible(uint256 tokenID)
        public
        view
        returns (uint256)
    {
        return collectibles[tokenID].lastTokenPrice;
    }

    function getAvailabilityOfToken(uint256 tokenID)
        public
        view
        returns (bool)
    {
        return availableToTradeCollectibles[tokenID];
    }

    function getTokenCount() public view returns (uint256) {
        return tokenCounter - 1;
    }

    function getTransactionFee() public view returns (uint256) {
        return transactionFee;
    }

    event NewCollectible(address from, uint256 tokendID);

    event CollectibleTransfer(address from, address to, uint256 tokendID);

    event NewCollectiblePrice(uint256 tokenID, uint256 price);

    event NewAvailabilityStatus(uint256 tokenID, bool availability);
}
