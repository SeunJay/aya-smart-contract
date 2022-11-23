// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";

contract AyaContract {
     address payable public owner;

      // A mapping is a key/value map. Here we store each account's balance.
    mapping(address => uint256) balances;

    modifier hasDeposit() {
        require(balances[msg.sender] > 0, "You have no deposits");
        _;
    }

     

     constructor(){
        owner = payable(msg.sender);
     }


     function deposit() public payable{
        // console.log('ether value', msg.value);
        balances[msg.sender] += msg.value;
     }

     function withdraw(uint256 amount) payable hasDeposit public {
        uint256 amountInETH = amount * (1 ether);
       require(balances[msg.sender] >=amountInETH, "You don't have enough ETH");
        
        (bool callSuccess, ) = payable(msg.sender).call{value: amount}("");
        require(callSuccess, "Call failed");

        balances[msg.sender] -= amountInETH;
     }


    function viewBalance(address account) public view returns (uint256){
        return balances[account];
    }
}