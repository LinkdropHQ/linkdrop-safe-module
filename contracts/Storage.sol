pragma solidity ^0.5.6;
import "@gnosis.pm/safe-contracts/contracts/base/ModuleManager.sol";

contract Storage {

    ModuleManager public manager;

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