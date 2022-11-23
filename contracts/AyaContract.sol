// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract AyaContract {
     address payable public owner;

      // A mapping is a key/value map. Here we store each account's balance.
    mapping(address => uint256) balances;

    modifier hasETH() {
        require(balances[msg.sender] > 0, "You don't have enough eth");
        _;
    }

     constructor(){
        owner = payable(msg.sender);
     }


     function deposit() public payable{
        // console.log('ether value', msg.value);
        balances[msg.sender] += msg.value;
     }

     function withdraw() payable hasETH public {
        (bool callSuccess, ) = payable(msg.sender).call{value: balances[msg.sender]}("");
        require(callSuccess, "Call failed");

        balances[msg.sender] -= balances[msg.sender];
     }


    function viewBalance(address account) public view returns (uint256){
        return balances[account];
    }
}