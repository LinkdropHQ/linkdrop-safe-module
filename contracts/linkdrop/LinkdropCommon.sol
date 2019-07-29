pragma solidity ^0.5.6;
import "openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "@gnosis.pm/safe-contracts/contracts/base/Module.sol";

/**
* @title Linkdrop common functionality
* @author Amir Jumaniyazov - <amir@linkdrop.io>
*/
contract LinkdropCommon is Module {

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

    event ClaimedERC721
    (
        address indexed linkId,
        uint weiAmount,
        address indexed nft,
        uint tokenId,
        address receiver,
        uint timestamp
    );

    /**
    * @dev Indicates whether a link is claimed or not
    * @param _linkId Address corresponding to link key
    * @return True if claimed
    */
    function isClaimedLink(address _linkId)
    public view
    returns (bool)
    {
        return claimedTo[_linkId] != address(0);
    }

    /**
    * @dev Indicates whether a link is canceled or not
    * @param _linkId Address corresponding to link key
    * @return True if canceled
    */
    function isCanceledLink(address _linkId)
    public view
    returns (bool)
    {
        return isCanceled[_linkId];
    }

}