// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;
import { Functions } from "./Functions.sol";

contract FunctionsParent {
    string public message;
    Functions functionsContract;

    constructor(address functionsContractAddr) {
        functionsContract = Functions(functionsContractAddr);
    }

    function testExternal() public view returns (uint256) {
        return functionsContract.checkGasleft();
    }
}
