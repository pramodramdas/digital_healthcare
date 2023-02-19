pragma solidity ^0.4.24;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
  function testItStoresAValue() public {
    SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());
    uint expected = 89;

    simpleStorage.set(expected);
    uint storageValue = simpleStorage.get();

    Assert.equal(storageValue, expected, "The value 89 should have been stored.");
  }
}
