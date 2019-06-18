pragma solidity ^0.5.0;
import "./LinkdropERC20.sol";

/**
* @title Linkdrop Module for Gnosis Safe
* @author Amir Jumaniyazov - <amir@linkdrop.io>
*/
contract LinkdropModule is LinkdropERC20 {

    string public constant NAME = "Linkdrop Module";
    string public constant VERSION = "0.1.0";

    // Function to setup the initial storage of module
    function setup(address[] _linkdropSigners)
    public
    {
        setManager();
        for (uint256 i = 0; i < _linkdropSigners.length; i++)
            isLinkdropSigner[_linkdropSigners[i]] = true;
    }

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

    /**
    * @dev Function to cancel a link, can only be called by owner
    * @param _linkId Address corresponding to link key
    * @return True if success
    */
    function cancel(address _linkId)
    external
    returns (bool)
    {
        require(OwnerManager(address(manager)).isOwner(msg.sender), "Only owner");
        require(!isClaimedLink(_linkId), "Claimed link");
        isCanceled[_linkId] = true;
        emit Canceled(_linkId, now);
        return true;
    }

    /**
    * @dev Function to add new signing key, can only be called via a Safe transaction
    * @param _linkdropSigner Address corresponding to signing key
    * @return True if success
    */
    function addSigner(address _linkdropSigner)
    external
    authorised
    returns (bool)
    {
        require(_linkdropSigner != address(0), "Invalid address");
        isLinkdropSigner[_linkdropSigner] = true;
        return true;
    }

    /**
    * @dev Function to remove signing key, can only be called via a Safe transaction
    * @param _linkdropSigner Address corresponding to signing key
    * @return True if success
    */
    function removeSigner(address _linkdropSigner)
    external
    authorised
    returns (bool)
    {
        require(isLinkdropSigner[_linkdropSigner], "Invalid address");
        isLinkdropSigner[_linkdropSigner] = false;
        return true;
    }

}