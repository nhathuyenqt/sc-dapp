// import logo from './logo.svg';
import './App.css';
import Header from './pages/Header';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Switch, Route, Redirect, withRouter } from 'react-router-dom';
import { AuthProvider, useAuth } from "./helper/AuthContext"
import PrivateRoute from "./components/PrivateRoute"
import Login from './pages/Login';
import Main from './pages/Main';
import { useState, useEffect, Suspense} from 'react';
import './pages/Login.css';


function App(props) {
  // const dispatch = useDispatch();
  // const { currentUser } = useAuth()
  useEffect(() => {

      // checkAutoLogin(dispatch, props.history);
  }, []);


  return (
          <Router>
            <AuthProvider>
              <Switch>
                <Route path='/login' exact component={Login} /> 
                <PrivateRoute exact path="/" component={Main} />
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