import React from 'react';

import {Typography, Button, AppBar, Spinner, Card,  CircularProgress, Container, CardActions, Grid, CardContent, CardMedia, TextField} from '@material-ui/core'

import  useStyles  from './Styles.js';
import {useState, useEffect} from 'react'
import {ethers} from 'ethers'
import { Dimmer, Loader, Image, Segment, } from 'semantic-ui-react'

import XContract from './../artifacts/contracts/XContract.sol/XContract.json'


const contractAddress = '0xc67F486b1d7f4Eaa44639B5e063E66B84CF4F512' // rinkeby
// const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
var loading = false;

function Home() {
  const classes = useStyles()

  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [loading, setLoading] = useState(false);
  const [balance, setBalance] = useState()
  const [amount, setAmount] = useState()
  const [recipient, setTo] = useState("0xC5e65BF63b33B865e78A02b13f0db60713c3Ff96")
  const [currentTime, setCurrentTime] = useState(0);

 
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
    console.log(accounts[0]);
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
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.register()
      // var accounts = await provider.getAccounts();
      // console.log(accounts[0])
      // await transaction.wait()
      // let a = '0'
      // signer.getAddress().then((address) => {
      //   a = address
      // });
      // let b = provider.getBalance(a)
      // setAddress(a)
      
      getBalance()
      // setLoading(false)
      // 
    }
  }

  async function sendCoins(){
    
    if (typeof window.ethereum !== 'undefined'){

      fetch("/genProof",
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                amt: amount
            }),
        }).then((response) => response.json())
        .then((data) => console.log(data));

      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.transfer(recipient, amount)
      await transaction.wait()
      
      contract.events.UpdateState({}, (error, msg)=> {
        if(!error) {
          console.log(msg);
          
        } else {
          console.log(error);
        }
      });
    }
  }

  return (
    <div className='home'>
      <h1>Home</h1>
      <Typography variant = "h4"> Nhat Huyen's Internship </Typography>
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
                  onChange={e => setGreetingValue(e.target.value)} 
                  placeholder="Set greeting"
                  value = {greeting}
                  variant='outlined'
                  fullWidth
                  color ="secondary"
                  className={classes.field}
                />
              </CardContent>
              <CardActions>
               
                <Button size ="small" color="primary" onClick={register} >Register</Button>
                <Button size ="small" color="primary" onClick={setGreeting} >Set</Button>
                <Button size ="small" color="primary" onClick={getBalance} >Update</Button>
                
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
              {loading && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              <Typography gutterBottom> {balance}</Typography>
              <TextField onChange={e => setTo(e.target.value)} placeholder="Recipient Account ID" 
                    variant='outlined'
                    fullWidth
                    color ="secondary"
                    value = {recipient}
                    className={classes.field}/>
              <TextField onChange={e => setAmount(e.target.value)} placeholder="Amount" variant='outlined'
                  fullWidth
                  color ="secondary"
                  className={classes.field}
                  
                /> 
            </CardContent>
            <CardActions>
              <Button size ="small" color="primary" onClick={getBalance} > Get Balance </Button>
              <Button size ="small" color="primary" onClick={sendCoins} >Send</Button>
    
              
            </CardActions>
          </Card>
          </Grid>
        </Grid>
      </Container>
      
    </div>
  );
}

export default Home;