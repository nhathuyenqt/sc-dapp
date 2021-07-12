import React from 'react';

import {Typography, Button, AppBar, Spinner, Card,  CircularProgress, Container, CardActions, Grid, CardContent, CardMedia, TextField} from '@material-ui/core'

import  useStyles  from './Styles.js';
import {useState} from 'react'
import {ethers} from 'ethers'
import { Dimmer, Loader, Image, Segment, } from 'semantic-ui-react'

import XContract from './../artifacts/contracts/XContract.sol/XContract.json'


// const contractAddress = '0x3a709513c233b2EFeCF984847Daa676291f8Bc1E'
const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'
var loading = false;

function Home() {
  const classes = useStyles()

  const [greeting, setGreetingValue] = useState('')
  const [userAccount, setUserAccount] = useState('')
  const [amount, setAmount] = useState(0)  

  async function updateStateEventListener(callback) {
    await requestAccount()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
    const updateStateEvent = contract.UpdateState()
    return updateStateEvent.watch(callback)
  }

  async function requestAccount(){
    await window.ethereum.request({method : 'eth_requestAccounts'})
    
  }

  async function setGreeting(){
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      await transaction.wait()

      const eventToAction = name => (err, result) => {
        console.log("hello")
      };
      let event = contract.TestMsg()
      event.watch(eventToAction("paid"))
      // console.log(transaction.events)
      // contract.events.TestMsg({}).on(
      //   'data2', event =>console.log(event))
      // contract.allEvents({
      //   fromBlock: 'latest',
      //         }, function (error, event) {
      //             if (error)
      //                 alert("error while subscribing to event")
      //             console.log(event)
      //             }
      //         );
      // contract.events.TestMsg({}, (error, msg)=> {
      //   if(!error) {
      //     console.log(msg);
      //     loading = false;
      //   } else {
      //     console.log(error);
      //   }
      // });
      //
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
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
      const signer =  provider.getSigner()
      const [account] = await window.ethereum.request({method: 'eth_requestAccounts'})
      const acc = signer.getAddress()
      const balance = await contract.balanceOf(account)
      console.log('provider: ', provider)
      console.log('signer: ', signer)
      console.log('address: ', acc)
      console.log('balance: ', balance.toString())
    
    }
  }

  async function register(){
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.register()
      await transaction.wait()
      // fetchBalance()
    }
  }

  async function sendCoins(){
    loading = true;
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.transfer(userAccount, amount)
      await transaction.wait()

      contract.events.UpdateState({}, (error, msg)=> {
        if(!error) {
          console.log(msg);
          loading = false;
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
      <Container maxWidth = "sm" className = {classes.cardGrid}> 
        <Grid container spacing ={4}>
          <Grid item> 
            <Card className ={classes.card} maxWidth = "md">
              {/* <CardMedia 
                className ={classes.cardMedia}
                  image ="https://source.unsplash.com/random"
                  title="Image title" /> */}

              <CardContent className = {classes.cardContent}>
                <Typography gutterBottom variant = "h5"> Say Greet </Typography>
       
                {/* <Dimmer active inverted>
                  <Loader>Loading</Loader>
                </Dimmer> */}
                {loading && (
                    <CircularProgress size={24} className={classes.buttonProgress} />
                )}
              
            
                {/* <Typography textAlign='left'> {balance} wei</Typography> */}
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
              <TextField onChange={e => setUserAccount(e.target.value)} placeholder="Account ID" 
                    variant='outlined'
                    fullWidth
                    color ="secondary"
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