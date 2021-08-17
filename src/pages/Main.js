import React from 'react';
import Navbar from '../components/Navbar';
import PrivateRoute from '../components/PrivateRoute';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Home from './Home';
import Posts from './Posts';
import Messages from './Messages';
import History from './History';
import Reports from './Reports';



function Main(){
    // if ( !authorized){
    //     return <Redirect to="/login"/>;
    // }
    return (
         <Router>
            <Navbar />
              <Switch>
                <PrivateRoute path='/' exact component={Home} />
                <PrivateRoute path='/posts' exact component={Posts} />
                <PrivateRoute path='/messages' exact component={Messages} />
                <Route path='/history' component={History} />
                <Route path='/reports' component={Reports} />
                {/* <Route path='/products' component={Products} /> */}
              </Switch> 
           </Router>

      );
}

export default Main;