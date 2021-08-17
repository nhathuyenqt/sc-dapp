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
export default App