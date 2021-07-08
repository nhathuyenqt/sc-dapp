// import logo from './logo.svg';
import './App.css';
import {useState} from 'react'
import {ethers} from 'ethers'
import XContract from './artifacts/contracts/XContract.sol/XContract.json'


const contractAddress = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9'

function App() {
  const [greeting, setGreetingValue] = useState()

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

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}> Fetch Greeting </button> 
        <button onClick={setGreeting}> Set Greeting </button>

        <input 
          onChange={e => setGreetingValue(e.target.value)} 
          placeholder="Set greeting"
          value={greeting}
        />
        
      </header>
    </div>
  );
}

export default App;
