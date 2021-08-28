// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;
import "hardhat/console.sol";

contract XContract{
    string public name = 'Xcontract';
    enum State {Processing, Assigned, WaitingValidation, Closed, Cancel}
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
        string requestOwner;   
        
    }

    struct Request{
        
        uint id;
        string content;
        string pubkeyOfSender;
        // string[4] proof;
        
        State state;     
        ElBalance acceptedPrice;   
        string worker; 
    }

    struct Message{
        bool code;
        uint requestId;
        ElBalance price;
        string requestOwner; 
    }

    struct Proof{
        uint id;
        uint requestId;
        string proofForAmt;
        string proofForRemainBalance; 
        string sigmaProof; 
        string input;
    }

    mapping(address => bool) private validAddress;
    mapping(address => string) private validPubkey;
    mapping(string => ElBalance) private encrytedBalance;
    mapping(string => address) private ownerOfPubkey;
    mapping(address => uint[]) private yourRequests;
    mapping(uint => Deal[]) private offers;
    mapping(string => Message[]) private messages;
    mapping(uint => Proof) private proofs;
    // mapping (string => ElBalance[]) private pendingList;

    address public association;
    Request[] private RequestList;
    uint [] private availableList;
    uint [] private notAvailableList;
    // AvailaleRequest[] availaleRequsestList;

    // uint numberOfClosedRq;
    uint numberOfRequest; 
    uint numberOfTransfer;
    // enum State {None, WaitingService, Available, OnWorking, Processing, Assigned, WaitingConfirm, Completed}
    

    // event InitBalance(string pk);
    event UpdateState(address add, uint balance);
    event NewPayment(uint requestId, uint id, string rangeproof1, string rangeproof2, string sigmaProof, string input);
    event NewPrice(uint id, string CL_price, string CR_price);
    // event makeDeal(uint id, string CL_price, string CR_price, string bidderKey);

    modifier onlyAdmin() {
      require(msg.sender == association, "You don't have privilege.");
      _;
    }

    constructor(){
        validAddress[msg.sender] = true;
        association = msg.sender;
        console.log("Deploy Successful, ",association);
        // numberOfClosedRq = 0;
        numberOfRequest = 0;
        numberOfTransfer = 0;
    }

    function authorizeNewUser(address[] memory newAcc) public onlyAdmin  {
        for(uint i=0; i<newAcc.length; i++){
            validAddress[newAcc[i]] = true;
        }
    }

    function checkAuthorizeNewUser(address newAcc) public view onlyAdmin returns (bool) {
        return    validAddress[newAcc];      
    }
 
    function initPocket(string calldata y, string calldata cL, string calldata cR) public {
        require(validAddress[msg.sender] == true, "You haven't registered. " );
        validPubkey[msg.sender] = y;
        ownerOfPubkey[y] = msg.sender;
        encrytedBalance[y] = ElBalance({CL : cL, CR : cR});    
        console.log("sender acc ", encrytedBalance[y].CL, " and ", encrytedBalance[y].CR);
    }


    function postTask(string memory _task) public {
        require(validAddress[msg.sender] == true, "You haven't registered.");
        RequestList.push(Request({
            content : _task,
            pubkeyOfSender : validPubkey[msg.sender],
            id : numberOfRequest,
            state : State.Processing,
            acceptedPrice : ElBalance({CL : "", CR : ""}),
            worker: ""
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
            bidder: validPubkey[msg.sender],
            requestOwner : RequestList[requestId].pubkeyOfSender
        }));
        emit NewPrice(requestId, CL_price, CR_price);
    }
    
    function loadOffers(uint id) public view returns (Deal[] memory){
        string memory pk = RequestList[id].pubkeyOfSender;
        console.log(pk);
        require(ownerOfPubkey[pk] == msg.sender, "You are not onwer of this task.");
        return offers[id];
    }

    function cancelRequest(uint id) public{
        string memory pk = RequestList[id].pubkeyOfSender;
        require(ownerOfPubkey[pk] == msg.sender, "You are not onwer of this task.");
        RequestList[id].state = State.Cancel;
        for (uint i=0; i<availableList.length; i++)
            if (availableList[i] == id){
                availableList[i] = availableList[availableList.length-1];
                availableList.pop();
                break;
            }
    }

    function acceptDeal(uint requestId, uint dealId) public {
        require(validAddress[msg.sender] == true, "You haven't registered.");
        string memory pk = RequestList[requestId].pubkeyOfSender;
        require(ownerOfPubkey[pk] == msg.sender, "You are not onwer of this task.");
        require(RequestList[requestId].state == State.Processing, "The task is no longer available.");
        require(offers[requestId][dealId].state == DealState.Processing, "The deal state is not valid.");
        RequestList[requestId].state = State.Assigned;

        for (uint i = 0; i<offers[requestId].length; i++)
            if (i != dealId){
                offers[requestId][i].state = DealState.Rejected;
                messages[offers[requestId][i].bidder].push(Message({
                    code : false,
                    requestId: requestId,
                    price: offers[requestId][i].price,
                    requestOwner : pk
                }));
            }

        offers[requestId][dealId].state = DealState.Accepted;
        messages[offers[requestId][dealId].bidder].push(Message({
                    code : true,
                    requestId: requestId,
                    price: offers[requestId][dealId].price,
                    requestOwner : pk
                }));       

        
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


    function payTheDeal(uint requestId, string memory proofForAmt, string memory proofForRemainBalance, string memory sigmaProof, string memory input) public {
        require(validAddress[msg.sender] == true, "Invalid Transaction" );
        string memory pk = RequestList[requestId].pubkeyOfSender;
        require(ownerOfPubkey[pk] == msg.sender, "Invalid Payment");
        if (RequestList[requestId].state == State.Assigned){
            RequestList[requestId].state = State.WaitingValidation;
            console.log("input ", input);
            // proofs[requestId] = Proof({
            //     id : numberOfTransfer,
            //     requestId : requestId,
            //     proofForAmt : proofForAmt,
            //     proofForRemainBalance : proofForRemainBalance,
            //     sigmaProof :sigmaProof,
            //     input : input
            // });
            
            numberOfTransfer += 1;
        }
        emit NewPayment(requestId, numberOfTransfer, proofForAmt, proofForRemainBalance, sigmaProof, input);
    }

    // function remindThePayment(uint requestId) public {
    //     require(validAddress[msg.sender] == true, "Invalid Transaction" );
    //     string memory pk = RequestList[requestId].pubkeyOfSender;
    //     require(ownerOfPubkey[pk] == msg.sender ||  ownerOfPubkey[RequestList[requestId].worker] == msg.sender, "Invalid Payment");
    //     require(RequestList[requestId].state == State.WaitingValidation, "Invalid Payment");
    //     Proof storage p = proofs[requestId];
    //     emit NewPayment(p.requestId, p.id, p.proofForAmt, p.proofForRemainBalance, p.sigmaProof, p.input);
    //     numberOfTransfer += 1;
    // }

    function fetchPubkey() public view returns (string memory){
        require(validAddress[msg.sender] == true);
                         
        return validPubkey[msg.sender];
    }

    function getMessages() public view returns (Message[] memory){
        require(validAddress[msg.sender] == true, "You haven't registered.");
        string memory pk = validPubkey[msg.sender];
        return messages[pk];
    }

    function confirmProof(uint requestId, string memory y, string memory C1, string memory C2, string memory yr, string memory C3, string memory C4) public onlyAdmin {
        require(RequestList[requestId].state == State.WaitingValidation, "The task is no longer available.");
        RequestList[requestId].state = State.Closed;
        encrytedBalance[y] = ElBalance({CL : C1, CR : C2});
        encrytedBalance[yr]= ElBalance({CL : C3, CR : C4});
    }
    
    function ElBalanceOf(string memory y) public view onlyAdmin returns (ElBalance memory){
        return encrytedBalance[y];
    }

    function yourBalance() external view returns (ElBalance memory){
        if (validAddress[msg.sender] == false)
            revert();
        string memory y = validPubkey[msg.sender];
        return encrytedBalance[y];
    }

    // function checkAuthorized() external view returns (bool){
    //     return validAddress[msg.sender];
    // }
    function hasPubKey() external view returns (bool){
        require(validAddress[msg.sender] == true, "You are not authorized.");
        if (bytes(validPubkey[msg.sender]).length == 0)
            return false;
        else
            return true;
    }
}