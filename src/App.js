// import logo from './logo.svg';
import './App.css';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Reports from './pages/Reports';
import GroupList from './pages/AdminPage';
// import Products from './pages/Products';

import { FirebaseDatabaseProvider } from "@react-firebase/database";

function App() {

  
  // const [greeting, setGreetingValue] = useState()

  // async function requestAccount(){

  // }
  // async function fetchGreeting(){
  //   if (typeof window.ethereum !== 'undefined'){
  //     const provider = new ethers.providers.Web3Provider(window.ethereum)
  //     const contract = new ethers.Contract(contractAddress, XContract.abi, provider)
  //     try{
  //       const data = await contract.greet()
  //       console.log('data: ', data)
  //     } catch(err){
  //       console.log("Error: ", err)
  //     }
  //   }
  // }

  // async function setGreeting(){
  //   if (!greeting) return
  //   if (typeof window.ethereum !== 'undefined'){
  //     await requestAccount()
  //     const provider = new ethers.providers.Web3Provider(window.ethereum);
  //     const signer = provider.getSigner();
  //     const contract = new ethers.Contract(contractAddress, XContract.abi, signer)
  //     const transaction = await contract.setGreeting(greeting)
  //     setGreetingValue('')
  //     await transaction.wait()
  //     fetchGreeting()
  //   }
  // }

  return (
    <div className="App">
      {/* //   <header className="App-header">
      //     {/* <button onClick={fetchGreeting}> Fetch Greeting </button> 
      //     <button onClick={setGreeting}> Set Greeting </button>

      //     <input 
      //       onChange={e => setGreetingValue(e.target.value)} 
      //       placeholder="Set greeting"
      //       value={greeting}
      //     /> 
          
      //   </header> */}
      <Router>
        <Navbar />
          <Switch>
            <Route path='/' exact component={Home} />
            <Route path='/history' component={History} />
            <Route path='/reports' component={Reports} />
            <Route path='/admin' component={GroupList} />
            {/* <Route path='/products' component={Products} /> */}
          </Switch>
      </Router>
      
    </div>
  );
}

export default App;
