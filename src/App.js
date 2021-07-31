// import logo from './logo.svg';
import './App.css';
import Header from './pages/Header';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import Home from './pages/Home';
import History from './pages/History';
import Reports from './pages/Reports';
import Posts from './pages/Posts';
import GroupList from './pages/AdminPage';
import { AuthProvider, useAuth } from "./helper/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
// import Products from './pages/Products';
import Login from './pages/Login';
import { checkAutoLogin } from './AuthFunction';

import Main from './pages/Main';
import { connect, useDispatch } from 'react-redux';
import { FirebaseDatabaseProvider } from "@react-firebase/database";
import { useState, useEffect, Suspense} from 'react';
import './pages/Login.css';
import {useHistory} from "react-router-dom"
import { isAuthenticated } from './pages/AuthSelector';

// function App() {
//   let history = useHistory()

//   const [authorized, setAuthorized] = useState(false);
//   const [user, setUser] = useState({name:"", address:""});
//   const [error, setError] = useState("");

//   const Login = details =>{
//     console.log(details);
//     console.log((details.name == 'admin' ));
//     if (details.name == 'admin'){
//       setAuthorized(true);
//       history.push("/dashboard");
//     }else{
      
//       setError("Details do not match!");
//       setAuthorized(false);
      
//     }
//   }


//   const Logout = () =>{
//     userHasAuthenticated(false);
//     history.push("/login");
//   }




function App(props) {
  // const dispatch = useDispatch();
  // const { currentUser } = useAuth()
  useEffect(() => {
      console.log(props);
      // checkAutoLogin(dispatch, props.history);
  }, []);

  

  let routes = (
      <Switch>
          {/* <Route exact path="/" component={() => <LoginForm  Login ={Login} error={error}/>} /> */}
          <Route exact  path='/login' component={Login} />
      </Switch>
  );

  // if (props.isAuthenticated) {
  // if (currentUser){
  //     routes = (
  //         <Switch>
  //             {/* <Route exact path="/dashboard" component={() => <Dashboard  authorized={authorized}/>} /> */}
  //             <Route path='/dashboard' component={Dashboard} />
  //             {/* <Redirect to='/' /> */}
  //         </Switch>
  //     );
  // }

  return (
      // <div>
      //     {/* <Header /> */}
      //     <div className='container px-3 mx-auto'>
      //         <Suspense fallback={<div>Loading...</div>}>
      //             {routes}
      //         </Suspense>
      //     </div>
      // </div>

          <Router>
            {/* <Navbar /> */}
            <AuthProvider>
              <Switch>
                <Route path='/login' exact component={Login} /> 
                <PrivateRoute exact path="/" component={Main} />
                {/*<Route path='/home' exact component={Home} />
                <Route path='/posts' component={Posts} />
                <Route path='/history' component={History} />
                <Route path='/reports' component={Reports} />
                <Route path='/admin' component={GroupList} />  */}
                

                {/* <Redirect to='/login' from='*' /> */}
                {/* <Route path='/products' component={Products} /> */}
              </Switch> 
            </AuthProvider>
          </Router>
  );
}

// const mapStateToProps = (state) => {
//   return {
//       isAuthenticated: isAuthenticated(state),
//   };
// };


// function App(){
//     return (
        
//         // <header className="App-header">
//         //       <button onClick={fetchGreeting}> Fetch Greeting </button> 
//         //       <button onClick={setGreeting}> Set Greeting </button>
    
//         //       <input 
//         //         onChange={e => setGreetingValue(e.target.value)} 
//         //         placeholder="Set greeting"
//         //         value={greeting}
//         //       /> 
              
//         //     </header> 
//          <Router>
//             {/* <Navbar /> */}
//               <Switch>
//                 <Route path='/login' exact component={Login} /> 
//                 <Route path='/' component={Dashboard} />  
//                 {/*<Route path='/home' exact component={Home} />
//                 <Route path='/posts' component={Posts} />
//                 <Route path='/history' component={History} />
//                 <Route path='/reports' component={Reports} />
//                 <Route path='/admin' component={GroupList} />  */}
                

//                 {/* <Redirect to='/login' from='*' /> */}
//                 {/* <Route path='/products' component={Products} /> */}
//               </Switch> 
//            </Router>

//       );
// }

// export default Dashboard;

export default App