pragma solidity ^0.5.6;
import "@gnosis.pm/safe-contracts/contracts/base/Module.sol";
import "./Storage.sol";

contract LinkdropCommon is Module, Storage {

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