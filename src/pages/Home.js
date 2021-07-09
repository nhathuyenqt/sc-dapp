import React from 'react';

import {Typography, Button, AppBar, Card, CardActions, CardContent, CardMedia} from '@material-ui/core'
import  useStyles  from './Styles.js';
import {useState} from 'react'
import {ethers} from 'ethers'
import XContract from './../artifacts/contracts/XContract.sol/XContract.json'


const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'


function Home() {
  const classes = useStyles()

  const [greeting, setGreetingValue] = useState()
  const [balance, setBalanceValue] = useState()
  
  async function requestAccount(){

  }
  async function fetchGreeting(){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
      try{
        const data = await contract.greet()
        console.log('data: ', data)
      } catch(err){
        console.log("Error: ", err)
      }
    }
  }

  async function setGreeting(){
    if (!greeting) return
    if (typeof window.ethereum !== 'undefined'){
      await requestAccount()
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
      const transaction = await contract.setGreeting(greeting)
      setGreetingValue('')
      await transaction.wait()
      fetchGreeting()
    }
  }

  async function fetchBalance(){
    if (typeof window.ethereum !== 'undefined'){
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
      const acc =  provider.getSigner().getAddress()
      try{
        console.log('provider: ', provider)
        console.log('signer: ', acc)
        const data = await contract.balanceOf(acc)
        const value = parseFloat(ethers.utils.formatUnits(data))
        setBalanceValue(value)
        console.log("data: ", data)
      } catch(err){
        console.log("Error: ", err)
      }
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
      fetchBalance()
    }
  }

  return (
    <div className='home'>
      <h1>Home</h1>
      <Typography variant = "h4"> Hello Nhat Huyen </Typography>
      <Card className ={classes.card} maxWidth = "md">
        {/* <CardMedia 
          className ={classes.cardMedia}
            image ="https://source.unsplash.com/random"
            title="Image title" /> */}

        <CardContent className = {classes.cardContent}>
          <Typography gutterBottom variant = "h5"> Balance </Typography>
          <Typography textAlign='left'> {balance} wei</Typography>
          <input 
            onChange={e => setGreetingValue(e.target.value)} 
            placeholder="Set greeting"
              
          />
        </CardContent>
        <CardActions>
          <Button size ="small" color="primary" onClick={register} >Register</Button>
          <Button size ="small" color="primary" onClick={fetchGreeting} >View</Button>
          <Button size ="small" color="primary" onClick={fetchBalance} >Update</Button>
          
        </CardActions>
      </Card>
      
    </div>
  );
}

export default Home;