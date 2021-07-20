pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


import "hardhat/console.sol";

contract XContract{
    string public name = 'Xcontract';
    string symbol;
    uint public totalSupply = 1000000;
    uint public initialSupply = 10000;

    mapping(address => uint) balance;
    mapping(address => bool) validAccount;
    address public association;
    Request[] requestList;
    uint numberOfClosedRq;
    uint numberOfRequest; 
    // enum State {None, WaitingService, Available, OnWorking, Processing, Assigned, WaitingConfirm, Completed}
    enum State {Processing, Assigned, WaitingPaid, Closed, Cancel}

    struct Request{
        address sender;
        uint id;
        string proof;
        State state;        
    }

    event UpdateState(address add, uint balance);
    event NewRequest(uint id, string proof);
    event TestMsg(string newMsg);
    
    modifier onlyAS() {
      require(msg.sender == association);
      _;
    }

    constructor(){
        balance[msg.sender] = totalSupply;
        association = msg.sender;
        symbol = "000";
        console.log("Changing greeting from '%s'", symbol);
        numberOfClosedRq = 0;
        numberOfRequest = 0;
    }

    function register(address newAcc) onlyAS public {
        balance[newAcc] = initialSupply;
        validAccount[newAcc] = true;
    }

    function fundToAccount(uint amt, address user) public onlyAS{
        balance[user] += amt;
    }

    function greet() public view returns (string memory) {
        return symbol;
    }

    function setGreeting(string memory _greeting) public {
        console.log("Changing greeting from '%s' to '%s'", symbol, _greeting);
        symbol = _greeting;
        emit TestMsg(symbol);
    }

    function privateTransfer(string memory y) public returns (uint){
        
        requestList.push(Request({
            sender : msg.sender,
            id : numberOfRequest,
            proof : y,
            state : State.Processing
        }));
        emit NewRequest(numberOfRequest, y);
        numberOfRequest += 1;

        return (numberOfRequest - 1); //id of his request
    }

    // function transfer(string) external {
    //     require(balances[msg.sender] >= amount, 'Not enough tokens');
    //     balances[msg.sender] -= amount;
    //     balances[to] += amount;
    //     emit UpdateState(msg.sender, balances[msg.sender]);
    //     // emit UpdateState(to, balances[to]);
    // }

    function transfer(address to, uint amount) external {
        require(balance[msg.sender] >= amount, 'Not enough tokens');
        balance[msg.sender] -= amount;
        balance[to] += amount;
        emit UpdateState(msg.sender, balance[msg.sender]);
        // emit UpdateState(to, balances[to]);
    }

    function confirmProof(uint id, bool res) public{
        if (res == true)
            requestList[id].state = State.Assigned;
        else
            requestList[id].state = State.Cancel;
    }   
    
    function balanceOf() external view returns (uint){
        if (validAccount[msg.sender] == false)
            revert();
        
        return balance[msg.sender];
    }

}