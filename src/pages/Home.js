import React from 'react';

import {Typography, Button, Card,  CircularProgress, Container, CardActions, Grid, CardContent, TextField} from '@material-ui/core'
import { Link } from "react-router-dom";
import QRCode from "react-qr-code";
import  useStyles  from './Styles.js';
import {useState, useEffect, useRef} from 'react'
import {ethers} from 'ethers'
import xtype from 'xtypejs'
import text  from './../contract_address.json';
import { useAuth } from "../helper/AuthContext"
import Switch from '@material-ui/core/Switch';
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'
import { ScannerOutlined } from '@material-ui/icons';
import QRscanner from './components/QRscanner.js';


const contractAddress = text['contract_address']

function Home(props) {
  // const history = useHistory();
  

  const { currentBCAccount, keypair, loading, balance, setBalance} = useAuth()

  const classes = useStyles()

  const [greeting, setGreetingValue] = useState('')
  const [amount, setAmount] = useState()
  const [recipient, setRecipient] = useState()
  const [post, setPost] = useState("")
  const [balanceView, setBalanceView] = useState(true);
  const [scan, setScan] = useState(false);
  const [scanDeal, setScanDeal] = useState(false);
  const [deal, setDeal] = useState()
  

  useEffect(() => {

  });
 
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

  const handleClickScan = () => {
    setScan(true);
  };

  const handleCloseScan = () => {
    setScan(false);
  };

  const handleCloseDeal = () => {
    setScanDeal(false);
  };

  // async function genProof() {
  //   const response = await fetch("/genProof", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({
  //       amt: amount,
  //     }),
  //   })
  //   let result
  //   await response.json().then((message) => {
  //     result = JSON.stringify(message["data"]);
     
  //     console.log(result) 
  //   });
  //   return result
  // }

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

      await response.json().then((message) => {
        message = message['balance']
        console.log(message)
        setBalance(message)
      });
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

    let messageProof = await genConfProof();
      console.log(messageProof);
      if (messageProof['code'] !== 200){
        const err = messageProof['err']
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
      <Container maxwidth = "sm" className = {classes.cardGrid}> 
        <Grid container spacing ={4}>
          <Grid item> 
            <Card className ={classes.card} maxwidth = "md">
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
              <Card className ={classes.card} maxwidth = "md">
            {/* <CardMedia 
              className ={classes.cardMedia}
                image ="https://source.unsplash.com/random"
                title="Image title" /> */}

            <CardContent className = {classes.cardContent}>
              <Typography gutterBottom variant = "h5"> Balance </Typography>
              <div style={{display: 'flex'}}>
                <Grid container align-items="center" spacing={2}>
                  <Grid item>Raw</Grid>
                  <Grid item >
                    <Switch
                   
                          checked={balanceView}
                          onChange={e => setBalanceView(e.target.checked)}
                          name="checkedA"
                          inputProps={{ 'aria-label': 'secondary checkbox' }}           />
                  </Grid>
                  <Grid item>Encrypted</Grid>
                </Grid>
              </div>
              {balanceView ?
              (<Typography variant = "subtitle2" gutterBottom>({balance.CL} {balance.CR}) </Typography>):
              (<Typography variant = "subtitle2" gutterBottom> {balance.b} </Typography>)}
              <TextField onChange={e => setRecipient(e.target.value)} placeholder="Recipient Public Key" 
                    variant='outlined'
                    fullWidth
                    color ="secondary"
                    value = {recipient}
                    className={classes.field}/>
              
              <TextField onChange={e => setAmount(e.target.value)} placeholder="Amount" variant='outlined'
                  fullWidth
                  color ="secondary"
                  className={classes.field}
                  defaultValue = {1}
                /> 
            </CardContent>
            <CardActions>
              <Button size ="small" color="primary" onClick={handleClickScan} >Scan Deal</Button>
              <Button size ="small" color="primary" onClick={handleClickScan} >Scan Recipient</Button>
              <Button size ="small" color="primary" onClick={getElBalance} >Get El Balance</Button>
              <Button size ="small" color="primary" onClick={confTransfer} >Conf Transfer</Button>
            </CardActions>
          </Card>
          </Grid>
          <Grid item>
              <Card className ={classes.card} maxwidth = "md">
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
        <QRscanner open={scan} onClose={handleCloseScan} setData = {setRecipient} />
        <QRscanner open={scanDeal} onClose={handleCloseDeal} setData = {deal}/>
      </Container>
    </div>)
  );
}

export default Home;