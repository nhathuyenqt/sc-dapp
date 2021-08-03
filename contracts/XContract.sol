pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;


import "hardhat/console.sol";

contract XContract{
    string public name = 'Xcontract';
    string symbol;
    uint public totalSupply = 1000000;
    uint public initialSupply = 10000;

    struct ElBalance {
        string CL;
        string CR;
    }

    mapping(address => uint) balance;
    mapping(address => bool) validAddress;
    mapping(address => string) validPubkey;
    mapping(string => ElBalance) public acc;
    
    address public association;
    Request[] requestList;
    uint numberOfClosedRq;
    uint numberOfRequest; 
    // enum State {None, WaitingService, Available, OnWorking, Processing, Assigned, WaitingConfirm, Completed}
    enum State {Processing, Assigned, WaitingPaid, Closed, Cancel}

    struct Request{
        address sender;
        uint id;
        // string[4] proof;
        State state;        
    }

    event InitBalance(string pk);
    event UpdateState(address add, uint balance);
    event NewRequest(uint id, string proof);
    event TestMsg(string newMsg);
    event NewConfTransfer(uint id, string rangeproof1, string rangeproof2, string sigmaProof, string input);
    
    modifier onlyAS() {
      require(msg.sender == association);
      _;
    }

    constructor(){
        balance[msg.sender] = totalSupply;
        validAddress[msg.sender] = true;
        association = msg.sender;
        symbol = "000";
        console.log("Deploy Successfull ");
        numberOfClosedRq = 0;
        numberOfRequest = 0;
    }

    function register(address newAcc)  public {
        balance[newAcc] = initialSupply;
        validAddress[newAcc] = true;
        
    }

    function registerKey(string calldata key) public {
        if (validAddress[msg.sender] == false)
            revert();
        emit InitBalance(key);               
    }

    function initElBalance(string calldata y, string calldata cL, string calldata cR) public {
        console.log(msg.sender);
        console.log(association);
        acc[y] = ElBalance({CL : cL, CR : cR});    
        console.log("sender acc ", acc[y].CL, " and ", acc[y].CR);
                 
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

    function confTransfer(string memory proofForAmt, string memory proofForRemainBalance, string memory sigmaProof, string memory input) public {
        
        requestList.push(Request({
            sender : msg.sender,
            id : numberOfRequest,
            
            state : State.Processing
        }));
        //// proof : [proofForAmt, proofForRemainBalance, sigmaProof, input],
        // emit NewRequest(numberOfRequest, y);
        console.log("Test Event'");
        emit NewConfTransfer(numberOfRequest, proofForAmt, proofForRemainBalance, sigmaProof, input);
        numberOfRequest += 1;

        // return (numberOfRequest - 1); //id of his request
    }

    function fetchPubkey() public returns (string memory){
        require(validAddress[msg.sender] == true);
                         
        return validPubkey[msg.sender];
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

    function updateBalance(string memory y, string memory C1, string memory C2, string memory yr, string memory C3, string memory C4) public {
        acc[y] = ElBalance({CL : C1, CR : C2});
        acc[yr] = ElBalance({CL : C3, CR : C4});
    }

    function confirmProof(uint id, bool res) public{
        if (res == true)
            requestList[id].state = State.Assigned;
        else
            requestList[id].state = State.Cancel;
    }   
    
    function balanceOf() external view returns (uint){
        if (validAddress[msg.sender] == false)
            revert();
        
        return balance[msg.sender];
    }

    function ElBalanceOf(string memory y) external view returns (ElBalance memory){
        
        // if (validAddress[msg.sender] == false)
        //     revert();
        console.log("sender ", msg.sender);
        
        return acc[y];
    }
}