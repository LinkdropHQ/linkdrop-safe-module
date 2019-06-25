pragma solidity ^0.5.0;
import "@gnosis.pm/safe-contracts/contracts/base/OwnerManager.sol";
import "./LinkdropERC20.sol";
import "./LinkdropERC721.sol";

/**
* @title Linkdrop Module for Gnosis Safe
* @author Amir Jumaniyazov - <amir@linkdrop.io>
*/
contract LinkdropModule is LinkdropERC20, LinkdropERC721 {

    string public constant NAME = "Linkdrop Module";
    string public constant VERSION = "0.1.0";

    /**
    * @dev Function to setup the initial storage of module
    * @param _linkdropSigners Array of linkdrop signer addresses
    */
    function setup(address[] memory _linkdropSigners)
    public
    {
        setManager();
        for(uint i = 0; i < _linkdropSigners.length; i++)
            isLinkdropSigner[_linkdropSigners[i]] = true;
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
    authorized
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
    authorized
    returns (bool)
    {
        require(isLinkdropSigner[_linkdropSigner], "Invalid address");
        isLinkdropSigner[_linkdropSigner] = false;
        return true;
    }

}