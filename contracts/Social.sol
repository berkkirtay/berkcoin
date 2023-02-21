// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Social {
    struct Post {
        address author;
        string text;
        uint256 date;
        int256 upvotes;
        mapping(address => int256) voters;
    }

    uint256 private postCounter;
    uint256 private postingFee;

    mapping(uint256 => Post) private posts;

    constructor() {
        postCounter = 0;
        postingFee = 10000;
    }

    function sendPost(string memory text, address owner) external {
        Post storage post = posts[postCounter];
        post.author = owner;
        post.text = text;
        post.date = block.timestamp;
        post.upvotes = 1;
        post.voters[owner] = 1;
        postCounter++;

        emit PostSent(owner, postCounter);
    }

    function burnPost(uint256 postID, address owner) external {
        require(
            owner == posts[postID].author,
            "Sender is not the owner of the post!"
        );
        posts[postID].author = address(0);
        posts[postID].text = "";

        emit PostBurned(owner, postID);
    }

    function votePost(
        uint256 postID,
        int256 vote,
        address owner
    ) external {
        // Check if the sender voted the post before:
        if (posts[postID].voters[owner] == 0) {
            posts[postID].voters[owner] = vote;
            posts[postID].upvotes += vote;
        }
        // If the post was voted before then retract the vote:
        else {
            posts[postID].upvotes -= posts[postID].voters[owner];
            posts[postID].voters[owner] = 0;
        }

        emit PostVoted(owner, postID, vote);
    }

    function getPostAuthor(uint256 postID) external view returns (address) {
        return posts[postID].author;
    }

    function getPostText(uint256 postID) external view returns (string memory) {
        return posts[postID].text;
    }

    function getPostDate(uint256 postID) external view returns (uint256) {
        return posts[postID].date;
    }

    function getPostUpvotes(uint256 postID) external view returns (int256) {
        return posts[postID].upvotes;
    }

    function getPostCount() external view returns (uint256) {
        return postCounter - 1;
    }

    function getPostingFee() external view returns (uint256) {
        return postingFee;
    }

    event PostSent(address from, uint256 postID);

    event PostBurned(address from, uint256 postID);

    event PostVoted(address from, uint256 postID, int256 vote);
}
