import React from 'react';

import {Typography, Button, Card,  CircularProgress, Container, CardActions, Grid, CardContent, TextField} from '@material-ui/core'
import QRCode from "react-qr-code";
import  useStyles  from './Styles.js';
import { withStyles } from '@material-ui/core/styles';
import {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import xtype from 'xtypejs'
import text  from './../contract_address.json';
import { useAuth } from "../helper/AuthContext"
import { purple } from '@material-ui/core/colors';

import Switch from '@material-ui/core/Switch';
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'

const PurpleSwitch = withStyles({
  switchBase: {
    color: purple[300],
    '&$checked': {
      color: purple[500],
    },
    '&$checked + $track': {
      backgroundColor: purple[500],
    },
  },
  checked: {},
  track: {},
})(Switch);
// const contractAddress = '0x2c934A1a4F5fC1E96Cf55FDbCbFc4614580B730a' // rinkeby
const contractAddress = text['contract_address']

function Home(props) {
  // const history = useHistory();


  const { currentBCAccount, keypair, loading, balance} = useAuth()

  const classes = useStyles()

  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')

  const [amount, setAmount] = useState()
  const [recipient, setTo] = useState()
  const [currentTime, setCurrentTime] = useState(0);
  const [accId, setAccId] = useState(0);
  const [noti, setNoti] = useState("")
  const [post, setPost] = useState("")
  const [balanceView, setBalanceView] = useState(true);


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
  
  async function matchPubkey(){
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const matchingPubkey = await contract.fetchPubkey.call();
      console.log(matchingPubkey)
    }
  }





  // const generateQrCode = async() => {
  //   try{
  //     const response = await QRCode.toDataURL('')
  //   }catch(error){
  //     console.log(error)
  //   }
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

 

  async function register(){
    // setLoading(true)
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
     
      console.log(result) 
    });
    return result
  }

  async function getElBalance(){

      const response = await fetch("/getElBalance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'x' : keypair.x,
          'y' : keypair.y,
          'user_key':currentBCAccount.privateKey
        }),
      })
      // setLoading(false)
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

      const response = await fetch("/genConfProof", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'privateKey': currentBCAccount.privateKey,
          'user_address': currentBCAccount.address,
          'y_sender': keypair.y,
          'y_recipient': recipient,
          'amt':amount,
          'b_after':197,
          'x_sender': keypair.x
        }),
      })
      // setLoading(false)
      let result
      await response.json().then((message) => {
        result = message
      });
      return result
  }
  async function newPost() {

      const response = await fetch("/newPost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          'privateKey': currentBCAccount.privateKey,
          'pubkey' : keypair.y,
          'content':post
        }),
      })

  }

  async function confTransfer() {
    setNoti("")
    let messageProof = await genConfProof();
      console.log(messageProof);
      if (messageProof['code'] != 200){
        const err = messageProof['err']
        setNoti(err);
        return 0

    // if (typeof window.ethereum !== "undefined") {
    //   await requestAccount();
    //   const provider = new ethers.providers.Web3Provider(window.ethereum);
    //   const signer = provider.getSigner();
    //   const contract = new ethers.Contract(
    //     contractAddress,
    //     XContract.abi,
    //     signer
    //   );
    //   // function sendPrivateToken(function() {
    //   //   console.log('huzzah, I\'m done!');
    //   // });
    //   let messageProof = await genConfProof();
    //   console.log(messageProof);
    //   if (messageProof['code'] != 200){
    //     const err = messageProof['err']
    //     setNoti(err);
    //     return 0
    //   }
  
      const pr1 = JSON.stringify(messageProof['rangeProofForAmt'])
      const pr2 = JSON.stringify(messageProof['rangeProofForRemainBalance'])
      const pr3 = JSON.stringify(messageProof['sigmaProtocol'])
      const data = JSON.stringify(messageProof['input'])
      // let msg2 = JSON.stringify(messageProof)
      // console.log(msg2)
      // // msg2 =  "hello"ßßßßßßßßß
      // const transaction = await contract.confTransfer(pr1, pr2, pr3, data);
      // 

      
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
    loading == true ? (<CircularProgress size={24} className={classes.buttonProgress} />) : (
    <div className='home'>
      <Typography align='center' variant = "h4"> Master Internship </Typography>
      <h1 align='center'>Home</h1>
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
                
                <div style={{display: 'flex'}}>
                  <QRCode value={keypair.y} size={110}/>
                  <div>
                    <Typography style={{display: 'flex', marginLeft: '10px'}} gutterBottom variant = "subtitle2"> {currentBCAccount.address} </Typography>
                    <Typography style={{display: 'flex', marginLeft: '10px'}} gutterBottom variant = "subtitle2"> {keypair.y} </Typography> 
                  </div>

                </div>
                {/* <input 
                  onChange={e => setGreetingValue(e.target.value)} 
                  placeholder="Set greeting"
                  value = {greeting}
                /> */}
    
              </CardContent>
              <CardActions>
               

                
                
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
              <div style={{display: 'flex'}}>
                <Grid container alignItems="center" spacing={2}>
                  <Grid item>Encrypted</Grid>
                  <Grid item sm ={6}>
                    <Switch
                   
                          checked={balanceView}
                          onChange={e => setBalanceView(e.target.checked)}
                          name="checkedA"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}           />
                  </Grid>
                  <Grid item>Raw</Grid>
                </Grid>
              </div>
              {balanceView ?
              (<Typography variant = "subtitle2" gutterBottom>({balance.CL},{balance.CR}) </Typography>):
              (<Typography variant = "subtitle2" gutterBottom> {balance.b} </Typography>)}
              <TextField onChange={e => setTo(e.target.value)} placeholder="Recipient Public Key" 
                    variant='outlined'
                    fullWidth
                    color ="secondary"
                    // defaultValue = {recipient}
                    className={classes.field}/>
              <TextField onChange={e => setAmount(e.target.value)} placeholder="Amount" variant='outlined'
                  fullWidth
                  color ="secondary"
                  className={classes.field}
                  defaultValue = {1}
                /> 
            </CardContent>
            <CardActions>
              <Button size ="small" color="primary" onClick={getElBalance} >Get El Balance</Button>
              <Button size ="small" color="primary" onClick={confTransfer} >Conf Transfer</Button>
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
              <Typography gutterBottom variant = "h5"> New post </Typography>
         
        
              <TextField onChange={e => setPost(e.target.value)} placeholder="Task" variant='outlined'
                  fullWidth
                  color ="secondary"
                  className={classes.field}
                  defaultValue = {post}
                /> 
            </CardContent>
            <CardActions>
              <Button size ="small" color="primary" onClick={newPost} >Post new task</Button>
            </CardActions>
          </Card>
          </Grid>
        </Grid>
      </Container>
    </div>)
  );
}

export default Home;