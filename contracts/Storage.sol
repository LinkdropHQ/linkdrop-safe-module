pragma solidity ^0.5.6;

contract Storage {

    mapping (address => address) claimedTo;
    mapping (address => bool) isCanceled;
    mapping (address => bool) isLinkdropSigner;

    event Canceled(address linkId, uint timestamp);

    event Claimed
    (
        address indexed linkId,
        uint weiAmount,
        address indexed token,
        uint tokenAmount,
        address receiver,
        uint timestamp
    );

}