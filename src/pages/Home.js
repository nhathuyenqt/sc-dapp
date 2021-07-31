import React from 'react';

import {Typography, Button, AppBar, Spinner, Card,  CircularProgress, Container, CardActions, Grid, CardContent, CardMedia, TextField} from '@material-ui/core'

import  useStyles  from './Styles.js';
import {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import xtype from 'xtypejs'
import text  from './../contract_address.json';
import { auth } from '../helper/Firebase';
import { useHistory } from 'react-router-dom';
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'
import { ContactSupportOutlined } from '@material-ui/icons';


// const contractAddress = '0x2c934A1a4F5fC1E96Cf55FDbCbFc4614580B730a' // rinkeby
const contractAddress = text['contract_address']
var loading = false;

function Home() {
  // const history = useHistory();

  // useEffect(() => {
  //   auth.onAuthStateChanged(user => {
  //       if (!user) history.push('/login');
  //   })
  // })

  const classes = useStyles()

  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState()
  const [amount, setAmount] = useState()
  const [recipient, setTo] = useState("0xC5e65BF63b33B865e78A02b13f0db60713c3Ff96")
  const [currentTime, setCurrentTime] = useState(0);
  const [accId, setAccId] = useState(0);
  const [accPubkey, setAccPubkey] = useState("");
  const [pubkeyList, setPubkeyList] = useState({});
  const [privkeyList, setPrivkeyList] = useState({});
  const [gList, setG] = useState({});
  const [noti, setNoti] = useState("")


  
  useEffect(() => {
    fetch('/time').then(res => res.json()).then(data => {
      setCurrentTime(data.time);
    });
  }, []);

  // useEffect(() => {
  //   requestAccount()
  // });
  if (window.ethereum){
    window.ethereum.on('accountsChanged', function(accounts){
      setUserAccount(accounts[0])

    })
  }

  // async function updateStateEventListener(callback) {
  //   await requestAccount()
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
  //   const updateStateEvent = contract.UpdateState()
  //   return updateStateEvent.watch(callback)
  // }

  async function requestAccount(){
    const accounts = await window.ethereum.request({method : 'eth_requestAccounts'})
    // console.log(accounts[0]);
    setUserAccount(accounts[0])

  }
  // function getAccounts(callback) {
  //   web3.eth.getAccounts((error,result) => {
  //       if (error) {
  //           console.log(error);
  //       } else {
  //           callback(result);
  //       }
  //   });
  // }
  

  async function setGreeting(){
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()

      contract.on("TestMsg", (msg) => {
        console.log('Msg : ', msg);
      });

      fetchGreeting()
    }
  }
  async function fetchGreeting(){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
      try{
        const data = await contract.greet()
        setGreetingValue(data)
        console.log('data: ', data)
      } catch(err){
        console.log("Error: ", err)
      }
    }
  }

  async function getBalance(){
    setLoading(true)
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
      const signer =  provider.getSigner()
      const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
      const acc = signer.getAddress()

      const b = await contract.balanceOf(account)
      // setAmount(balance.toString())
      console.log('provider: ', provider)
      console.log('signer: ', signer)
      console.log('address: ', acc)
      console.log('balance: ', b.toString())
      setBalance(b.toString())
      setLoading(false)
    }
  }

  async function register(){
    setLoading(true)
    if (typeof window.ethereum !== 'undefined'){
      // await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer ", signer)
      // const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      // const transaction = await contract.register()
      // var accounts = await provider.getAccounts();
      // console.log(accounts[0])
      // await transaction.wait()
      // let a = '0'
      // signer.getAddress().then((address) => {
      //   a = address
      // });
      // let b = provider.getBalance(a)
      // setAddress(a)
      
      // getBalance()
      // setLoading(false)
      // 
    }
  }

  async function genKey(){
    console.log(accId)
    const response = await fetch("/genKey", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accId: accId
      }),
    })

    let result
    await response.json().then((message) => {
      result = message["data"];
      console.log(result);
      const y = result["y"];
      const x = result["x"];
      const g = result['g']
      let sKey =  privkeyList
      let pubkey = pubkeyList
      let G = gList
      const i = parseInt(accId, 10)
      pubkey[i] = y;
      sKey[i] = x
      G[i] = g
      setPubkeyList(pubkeyList);
      setG(G);
      setPrivkeyList(sKey);
      console.log("pubkey1 ", pubkeyList);
      console.log("privkey1 ", privkeyList);
    });

      
      console.log("pubkey ", pubkeyList);

  }

  async function genProof() {
    const response = await fetch("/genProof", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amt: amount,
      }),
    })
    let result
    await response.json().then((message) => {
      result = JSON.stringify(message["data"]);
     

    });
    return result
  }

  async function getElBalance(){
    setLoading(true)
    if (typeof window.ethereum !== 'undefined'){

      const response = await fetch("/getElBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'x' : privkeyList[accId],
          'y' : pubkeyList[accId],
          'g' : gList[accId],
        }),
      })
      setLoading(false)
      // const provider = new ethers.providers.Web3Provider(window.ethereum)
      // const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
      // const signer =  provider.getSigner()
      // const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
      // const acc = signer.getAddress()
      // const b = await contract.ElBalanceOf(y)
      // console.log('address: ', acc)
      // console.log('balance: ', b.toString())
      // setBalance(b.toString())
      // setLoading(false)
    }
  }

  async function sendPrivateToken() {
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        XContract.abi,
        signer
      );
      // function sendPrivateToken(function() {
      //   console.log('huzzah, I\'m done!');
      // });
      let messageProof = await genProof();
      // console.log("Check type of Proof 1 : ", messageProof);
      // console.log("hello 2");
      // let msg2 = JSON.stringify(messageProof)
      // msg2 =  "hello"
      // const transaction = await contract.privateTransfer(msg2);
      // console.log("transaction", transaction);

      
    }
  }

  async function genConfProof() {
    setLoading(true)
    console.log("g ", gList[0])
      const response = await fetch("/genConfProof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'y_sender': pubkeyList[0],
          'y_recipient': pubkeyList[1],
          'g_sender': gList[0],
          'amt':amount,
          'b_after':197,
          'x_sender': privkeyList[0]
        }),
      })
      setLoading(false)
      let result
      await response.json().then((message) => {
        result = message
      });
      return result
  }

  async function confTransfer() {
    setNoti("")
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        XContract.abi,
        signer
      );
      // function sendPrivateToken(function() {
      //   console.log('huzzah, I\'m done!');
      // });
      let messageProof = await genConfProof();
      console.log(messageProof);
      if (messageProof['code'] != 200){
        const err = messageProof['err']
        setNoti(err);
        return 0
      }
  
      const pr1 = JSON.stringify(messageProof['rangeProofForAmt'])
      const pr2 = JSON.stringify(messageProof['rangeProofForRemainBalance'])
      const pr3 = JSON.stringify(messageProof['sigmaProtocol'])
      const data = JSON.stringify(messageProof['input'])
      // let msg2 = JSON.stringify(messageProof)
      // console.log(msg2)
      // // msg2 =  "hello"ßßßßßßßßß
      // const transaction = await contract.confTransfer(pr1, pr2, pr3, data);
      // console.log("transaction", transaction);

      
    }
  }
  
  async function sendCoins(){
    var messageProof
    if (typeof window.ethereum !== 'undefined'){

      fetch("/genProof",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amt: amount
            }),
        }).then((response) => response.json())
        .then((message) => {
          messageProof = JSON.stringify(message['data'])
          console.log(messageProof)
          console.log("Check type of Proof: ", xtype(messageProof))
        });
     
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.transfer(recipient, amount)
      // const transaction = await contract.privateTransfer(messageProof)
      
      // await transaction.wait()
      
      contract.on("UpdateState", (add, newBal) => {
   
          console.log("sender ", add)
          console.log("new Balance ", newBal.toString())
          
       
      });
    }
  }

  return (
    <div className='home'>
      <h1 align='center'>Home</h1>
      <Typography align='center' variant = "h4"> Nhat Huyen's Internship </Typography>
      <p>The current time is {currentTime}.</p>
      <Container maxWidth = "sm" className = {classes.cardGrid}> 
        <Grid container spacing ={4}>
          <Grid item> 
            <Card className ={classes.card} maxWidth = "md">
              {/* <CardMedia 
                className ={classes.cardMedia}
                  image ="https://source.unsplash.com/random"
                  title="Image title" /> */}

              <CardContent className = {classes.cardContent}>
                <Typography gutterBottom variant = "h5"> Account </Typography>
                
                {/* <Dimmer active inverted>
                  <Loader>Loading</Loader>
                </Dimmer> */}
                
              
            
                <Typography textAlign='left'> {userAccount} </Typography>
                <Typography textAlign='left'> {greeting}</Typography>
                {/* <input 
                  onChange={e => setGreetingValue(e.target.value)} 
                  placeholder="Set greeting"
                  value = {greeting}
                /> */}
                <TextField
                  onChange={e => setAccId(e.target.value)} 
                  placeholder="ACC ID"
                  variant='outlined'
                  fullWidthadf
                  color ="secondary"
                  className={classes.field}
                />
              </CardContent>
              <CardActions>
               
                <Button size ="small" color="primary" onClick={register} >Register</Button>
                <Button size ="small" color="primary" onClick={genKey} >Generate Key-pair</Button>
                <Button size ="small" color="primary" onClick={getElBalance} >Get El Balance</Button>
                
              </CardActions>
            </Card>
          </Grid>
          <Grid item>
              <Card className ={classes.card} maxWidth = "md">
            {/* <CardMedia 
              className ={classes.cardMedia}
                image ="https://source.unsplash.com/random"
                title="Image title" /> */}

            <CardContent className = {classes.cardContent}>
              <Typography gutterBottom variant = "h5"> Balance </Typography>
              <Typography textAlign='left'> {noti} </Typography>
              {loading && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              <Typography gutterBottom> {balance}</Typography>
              <TextField onChange={e => setAccPubkey(e.target.value)} placeholder="My Account Public Key" 
                    variant='outlined'
                    fullWidth
                    color ="secondary"
                    value = {accPubkey}
                    className={classes.field}/>
              <TextField onChange={e => setTo(e.target.value)} placeholder="Recipient Public Key" 
                    variant='outlined'
                    fullWidth
                    color ="secondary"
                    defaultValue = {recipient}
                    className={classes.field}/>
              <TextField onChange={e => setAmount(e.target.value)} placeholder="Amount" variant='outlined'
                  fullWidth
                  color ="secondary"
                  className={classes.field}
                  defaultValue = {1}
                /> 
            </CardContent>
            <CardActions>
              <Button size ="small" color="primary" onClick={getBalance} > Get Balance </Button>
              <Button size ="small" color="primary" onClick={sendCoins} >Send</Button>
              <Button size ="small" color="primary" onClick={sendPrivateToken} >Send Token</Button>
              <Button size ="small" color="primary" onClick={confTransfer} >Conf Transfer</Button>
              
            </CardActions>
          </Card>
          </Grid>
        </Grid>
      </Container>
 
      
    </div>
  );
}

export default Home;