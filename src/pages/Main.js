import React from 'react';
import Navbar from '../components/Navbar';
import PrivateRoute from '../components/PrivateRoute';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Posts from './Posts';
import History from './History';
import Reports from './Reports';
import GroupList from './AdminPage';


function Main(){
    // if ( !authorized){
    //     return <Redirect to="/login"/>;
    // }
    return (
        
        // <header className="App-header">
        //       <button onClick={fetchGreeting}> Fetch Greeting </button> 
        //       <button onClick={setGreeting}> Set Greeting </button>
    
        //       <input 
        //         onChange={e => setGreetingValue(e.target.value)} 
        //         placeholder="Set greeting"
        //         value={greeting}
        //       /> 
              
        //     </header> 
         <Router>
            <Navbar />
              <Switch>
                <PrivateRoute path='/' exact component={Home} />
                <PrivateRoute path='/posts' component={Posts} />
                <Route path='/history' component={History} />
                <Route path='/reports' component={Reports} />
                <Route path='/admin' component={GroupList} />
                {/* <Route path='/products' component={Products} /> */}
              </Switch> 
           </Router>

      );
}

export default Main;