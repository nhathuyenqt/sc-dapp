pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "hardhat/console.sol";

contract XContract{
    string public name = 'Xcontract';
    string symbol;
    uint public totalSupply = 1000000;
    uint public initialSupply = 10000;
    bytes private tempEmptyStringTest = bytes("");
    struct ElBalance {
        string CL;
        string CR;
    }

    mapping(address => bool) private validAddress;
    mapping(address => string) private validPubkey;
    mapping(string => ElBalance) private encrytedBalance;
    mapping(string => address) private ownerOfPubkey;
    
    address public association;
    Request[] requestList;
    // AvailaleRequest[] availaleRequsestList;

    uint numberOfClosedRq;
    uint numberOfRequest; 
    // enum State {None, WaitingService, Available, OnWorking, Processing, Assigned, WaitingConfirm, Completed}
    enum State {None, Processing, Assigned, WaitingPaid, Closed, Cancel}

    struct Request{
        
        uint id;
        string content;
        string pubkeyOfSender;
        // string[4] proof;

        State state;        
    }

    struct AvailableRequest{
        uint id;
        string content;
        State state; 
    }


    event InitBalance(string pk);
    event UpdateState(address add, uint balance);
    event NewRequest(uint id, string proof);
    event TestMsg(string newMsg);
    event NewConfTransfer(uint id, string rangeproof1, string rangeproof2, string sigmaProof, string input);
    event aNewPrice(uint id,string _price, string bidderKey);

    modifier onlyAdmin() {
      require(msg.sender == association, "You are not authorized.");
      _;
    }

    constructor(){
        validAddress[msg.sender] = true;
        association = msg.sender;
        symbol = "000";
        console.log("Deploy Successfull ");
        numberOfClosedRq = 0;
        numberOfRequest = 0;
    }

    function authorizeNewUser(address[] memory newAcc) public onlyAdmin  {
        
        for(uint i=0; i<newAcc.length; i++){
            validAddress[newAcc[i]] = true;
            // console.log(newAcc[i]);
        }
        // console.log( newAcc);
        
    }

    // function registerKey(string  memory key, string  memory b1, string memory b2) public {
    //     if (validAddress[msg.sender] == false)
    //         revert();
    //     if ((validPubkey[msg.sender]) && (validPubkey[msg.sender] != key))
    //         revert();
    //     validPubkey[msg.sender] = key;
    //     balanceOf[key] = ElBalance({CL:b1, CR:b2});
    //     emit InitBalance(key);               
    // }

    function initPocket(string calldata y, string calldata cL, string calldata cR) public {
        require(validAddress[msg.sender] == true, "You haven't registered. " );
        validPubkey[msg.sender] = y;
        encrytedBalance[y] = ElBalance({CL : cL, CR : cR});    
        console.log("sender acc ", encrytedBalance[y].CL, " and ", encrytedBalance[y].CR);
                 
    }

    // function fundToAccount(uint amt, address user) public onlyAS{
    //     balance[user] += amt;
    // }

    function greet() public view returns (string memory) {
        return symbol;
    }

    function postTask(string memory _task) public {
        require(validAddress[msg.sender] == true, "You haven't registered." );
        requestList.push(Request({
            content : _task,
            pubkeyOfSender : "",
            id : numberOfRequest,
            state : State.None
        }));
    }

    function raiseAPrice(string memory _price, uint id) public {
        require(validAddress[msg.sender] == true, "You haven't registered. ");
        // string memory requestSenderKey = requestList[id].pubkeyOfSender;
        // address requestSender = ownerOfPubkey[requestSenderKey];
        string memory bidderKey = validPubkey[msg.sender];
        emit aNewPrice(id, _price, bidderKey);
    }
    
    function assignWithAcceptionOfPrice(string memory _price, uint id) public {
        require(validAddress[msg.sender] == true, "You haven't registered. ");
        // require(keccak256(validPubkey[msg.sender]) == keccak256(requestList[id].pubkeyOfSender), "You are not allowed");
        // string memory requestSenderKey = requestList[id].pubkeyOfSender;
        // address requestSender = ownerOfPubkey[requestSenderKey];
        string memory bidderKey = validPubkey[msg.sender];
        emit aNewPrice(id, _price, bidderKey);
    }

    function getTasks() public view returns(Request[] memory){
        return requestList;
    }

    function confTransfer(string memory proofForAmt, string memory proofForRemainBalance, string memory sigmaProof, string memory input) public {
        require(validAddress[msg.sender] == true, "You haven't registered. " );
        requestList.push(Request({
            pubkeyOfSender : validPubkey[msg.sender],
            id : numberOfRequest,
            content: "",
            state : State.Processing
        }));
        //// proof : [proofForAmt, proofForRemainBalance, sigmaProof, input],
        // emit NewRequest(numberOfRequest, y);
        console.log("Test Event'");
        emit NewConfTransfer(numberOfRequest, proofForAmt, proofForRemainBalance, sigmaProof, input);
        numberOfRequest += 1;

        // return (numberOfRequest - 1); //id of his request
    }

    function fetchPubkey() public view returns (string memory){
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

    // function transfer(address to, uint amount) external {
    //     require(balance[msg.sender] >= amount, 'Not enough tokens');
    //     balance[msg.sender] -= amount;
    //     balance[to] += amount;
    //      emit UpdateState(msg.sender, balance[msg.sender]);
    //     // emit UpdateState(to, balances[to]);
    // }

    function updateBalance(string memory y, string memory C1, string memory C2, string memory yr, string memory C3, string memory C4) public {
        encrytedBalance[y] = ElBalance({CL : C1, CR : C2});
        encrytedBalance[yr] = ElBalance({CL : C3, CR : C4});
    }

    function confirmProof(uint id, bool res) public{
        if (res == true)
            requestList[id].state = State.Assigned;
        else
            requestList[id].state = State.Cancel;
    }   
    
    function balanceOf() external view returns (ElBalance memory){
        if (validAddress[msg.sender] == false)
            revert();
        string storage y = validPubkey[msg.sender];
        return encrytedBalance[y];
    }

    function ElBalanceOf(string memory y) external view returns (ElBalance memory){
        
        // if (validAddress[msg.sender] == false)
        //     revert();
        console.log("sender ", msg.sender);
        
        return encrytedBalance[y];
    }

    function checkAuthorized() external view returns (bool){
        return validAddress[msg.sender];
    }
    function hasPubKey() external view returns (bool){
        require(validAddress[msg.sender] == true, "You are not authorized.");
        if (bytes(validPubkey[msg.sender]).length == 0)
            return false;
        else
            return true;
    }
}