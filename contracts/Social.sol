// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract Social {
    struct Post {
        address author;
        string title;
        string text;
        uint256 date;
        int256 upvotes;
        mapping(address => int256) voters;
    }

    uint256 public postCounter;
    mapping(uint256 => Post) public posts;

    constructor() {
        postCounter = 0;
    }

    function sendPost(string memory title, string memory text) external {
        /*
        require(
            balanceOf(msg.sender) >= 1,
            "Sender must own berkcoins to post!"
        );
        */

        Post storage post = posts[postCounter];
        post.author = msg.sender;
        post.title = title;
        post.text = text;
        post.date = block.timestamp;
        post.upvotes = 1;
        post.voters[msg.sender] = 1;
        postCounter++;

        emit PostSent(msg.sender, postCounter);
    }

    function burnPost(uint256 postID) external {
        require(
            msg.sender == posts[postID].author,
            "Sender is not the owner of the post!"
        );
        posts[postID].author = address(0);
        posts[postID].title = "";
        posts[postID].text = "";

        emit PostBurned(msg.sender, postID);
    }

    function votePost(uint256 postID, int256 vote) external {
        // Check if the sender voted the post before:
        if (posts[postID].voters[msg.sender] == 0) {
            posts[postID].voters[msg.sender] = vote;
            posts[postID].upvotes += vote;
        }
        // If the post was voted before then retract the vote:
        else {
            posts[postID].upvotes -= posts[postID].voters[msg.sender];
            posts[postID].voters[msg.sender] = 0;
        }

        emit PostVoted(msg.sender, postID, vote);
    }

    function getPostAuthor(uint256 postID) external view returns (address) {
        return posts[postID].author;
    }

    function getPostTitle(uint256 postID)
        external
        view
        returns (string memory)
    {
        return posts[postID].title;
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

    event PostSent(address from, uint256 postID);

    event PostBurned(address from, uint256 postID);

    event PostVoted(address from, uint256 postID, int256 vote);
}
