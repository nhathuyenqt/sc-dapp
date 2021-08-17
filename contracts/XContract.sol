// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;


import "hardhat/console.sol";

contract XContract{
    string public name = 'Xcontract';
    string symbol;
    uint public totalSupply = 1000000;
    uint public initialSupply = 10000;
    bytes private tempEmptyStringTest = bytes("");
    enum State {Processing, Assigned, WaitingPaid, Closed, Cancel}
    enum DealState {Processing, Rejected, Accepted}
    
    struct ElBalance {
        string CL;
        string CR;
    }

    struct Deal {
        uint dealId;
        ElBalance price;
        uint requestId;
        DealState state;
        string bidder;        
    }

    struct Request{
        
        uint id;
        string content;
        string pubkeyOfSender;
        // string[4] proof;
        State state;        
    }

    struct TrackingDeal{
        uint requestId;
        uint dealId;     
    }

    mapping(address => bool) private validAddress;
    mapping(address => string) validPubkey;
    mapping(string => ElBalance) private encrytedBalance;
    mapping(string => address) private ownerOfPubkey;
    mapping(address => uint[]) private yourRequests;
    mapping(uint => Deal[]) private offers;
    mapping(string => string[]) private messages;

    address public association;
    Request[] private RequestList;
    uint [] private availableList;
    uint [] private notAvailableList;
    // AvailaleRequest[] availaleRequsestList;

    uint numberOfClosedRq;
    uint numberOfRequest; 
    // enum State {None, WaitingService, Available, OnWorking, Processing, Assigned, WaitingConfirm, Completed}
    
   
    event InitBalance(string pk);
    event UpdateState(address add, uint balance);
    event NewRequest(uint id, string proof);
    event TestMsg(string newMsg);
    event NewConfTransfer(uint id, string rangeproof1, string rangeproof2, string sigmaProof, string input);
    event NewPrice(uint id, string CL_price, string CR_price);
    event makeDeal(uint id, string CL_price, string CR_price, string bidderKey);

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
        }
    }

    function checkAuthorizeNewUser(address newAcc) public view onlyAdmin returns (bool) {
        
        
        return    validAddress[newAcc];
       
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
        ownerOfPubkey[y] = msg.sender;
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
        require(validAddress[msg.sender] == true, "You haven't registered.");
        RequestList.push(Request({
            content : _task,
            pubkeyOfSender : validPubkey[msg.sender],
            id : numberOfRequest,
            state : State.Processing
        }));

        yourRequests[msg.sender].push(numberOfRequest);
        availableList.push(numberOfRequest);
        numberOfRequest +=1;
    }

    function raiseAPrice(uint requestId,string memory CL_price, string memory CR_price) public {
        require(validAddress[msg.sender] == true, "You haven't registered.");
        require(RequestList[requestId].state == State.Processing, "The task is no longer available.");
        uint dealId = offers[requestId].length;

        offers[requestId].push(Deal({
            price: ElBalance({CL : CL_price,
            CR : CR_price}),
            requestId: requestId,
            dealId : dealId,
            state: DealState.Processing,
            bidder: validPubkey[msg.sender]   
        }));

    }
    
    function loadOffers(uint id) public view returns (Deal[] memory){
        string memory pk = RequestList[id].pubkeyOfSender;
        console.log(pk);
        require(ownerOfPubkey[pk] == msg.sender, "You are not onwer of this task.");
        return offers[id];
    }

    function acceptDeal(uint requestId, uint dealId, string calldata requestId_str) public {
        require(validAddress[msg.sender] == true, "You haven't registered.");
        string memory pk = RequestList[requestId].pubkeyOfSender;
        require(ownerOfPubkey[pk] == msg.sender, "You are not onwer of this task.");
        require(RequestList[requestId].state == State.Processing, "The task is no longer available.");
        require(offers[requestId][dealId].state == DealState.Processing, "The deal state is not valid.");
        string memory m  = string(abi.encodePacked("Your offer for Request ", requestId_str, "is rejected."));
        for (uint i = 0; i<offers[requestId].length; i++)
            if (i != dealId){
            offers[requestId][i].state = DealState.Rejected;
            messages[offers[requestId][dealId].bidder].push(m);
        }
    
        offers[requestId][dealId].state = DealState.Accepted;
        m  = string(abi.encodePacked("Your offer for Request ", requestId_str, "is Accepted."));
        string memory offerSender = offers[requestId][dealId].bidder;
        messages[offerSender].push(m);
        RequestList[requestId].state = State.Assigned;
        // notAvailableList.push(id);
        for (uint i=0; i<availableList.length; i++)
            if (availableList[i] == requestId){
                availableList[i] = availableList[availableList.length-1];
                availableList.pop();
                break;
            }
    }

    function getAllAvailableTasks() public view returns(Request[] memory){
        Request[] memory ret = new Request[](availableList.length);
        for (uint i = 0; i < availableList.length; i++) {
            ret[i] = RequestList[availableList[i]];
        }
        return ret;
    }

    function getYourTasks() public view returns(Request[] memory){
        Request[] memory ret = new Request[](yourRequests[msg.sender].length);
        for (uint i = 0; i < yourRequests[msg.sender].length; i++) {
            ret[i] = RequestList[yourRequests[msg.sender][i]];
        }
        return ret;
    }

    function confTransfer(string memory proofForAmt, string memory proofForRemainBalance, string memory sigmaProof, string memory input) public {
        require(validAddress[msg.sender] == true, "You haven't registered. " );
        // availableList[numberOfRequest] = Request({
        //     pubkeyOfSender : validPubkey[msg.sender],
        //     id : numberOfRequest,
        //     content: "",
        //     state : State.Closed
        // });
        
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
            RequestList[id].state = State.Assigned;
        // else
            // RequestList[id].state = State.Cancel;
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