pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract XContract{

    string public name = 'Xcontract';
    string symbol;
    uint public totalSupply = 1000000;
    uint public initialSupply = 10000;

    mapping(address => uint) balances;
    address public association;

    
    modifier onlyAS() {
      require(msg.sender == association);
      _;
    }

    constructor(){
        balances[msg.sender] = totalSupply;
        association = msg.sender;
        symbol = "000";
    }

    function register() public {
        balances[msg.sender] = initialSupply;
    }

    function fundToAccount(uint amt, address user) public onlyAS{
        balances[user] += amt;
    }

    function greet() public view returns (string memory) {
        return symbol;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", symbol, _greeting);
        symbol = _greeting;
    }

    function sendProof(string memory _taux, string memory _muy, string memory _t, string memory _l, string memory _r, string memory _A, string memory _S, string memory _T1, string memory _T2, string memory _V, string memory _sig) public view {
        console.log("Proof.taux : ", _taux);
        console.log("Proof.muy : ", _muy);
        console.log("Proof.muy : ", _t);
    }

    function transfer(address to, uint amount) external {
        require(balances[msg.sender] >= amount, 'Not enough tokens');
        balances[msg.sender] -= amount;
        balances[to] += amount;
    }

    function balanceOf(address account) external view returns (uint){
        return balances[account];
    }

}