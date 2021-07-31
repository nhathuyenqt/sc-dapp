import React from 'react';
import logo from './logo.svg';
// import {ReactComponet as Logo} 
import { connect, useDispatch } from 'react-redux';

import { useAuth } from "../helper/AuthContext"
import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {Typography, Button, AppBar, Spinner, Card,  CircularProgress, Container, CardActions, Grid, CardContent, CardMedia, TextField} from '@material-ui/core'
import './Login.css';

function Login(props) {
    
    let errorsObj = { name: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);

    const [infoUser, setInfoUser] = useState({email:"huyen12@gmail.com", address:"", password:"123456"})

    const dispatch = useDispatch();
    
    const {login} = useAuth()
    let history = useHistory()
    async function handleLogin() {
        // setError("")
        try {
            await login(infoUser.email, infoUser.password)
            history.push("/")
        } catch {
        // setError("Failed to log out")
        }
    }
    

    return(
        
        <form >
            <div className ="form-inner">
                <h2> Login</h2>
                {(errors == false) ? (<div className="error">{errorsObj}</div>):""}           
                    <div className="form-group">
                        <label htmlFor="name">Email:</label>
                        <input type="text" name="email" id="email" onChange={e => setInfoUser({...infoUser, email:e.target.value})} value = {infoUser.email}></input>

                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Password:</label>
                        <input type="text" name="password" id="password" onChange={e => setInfoUser({...infoUser, password:e.target.value})} value = {infoUser.password}></input>
                    </div>
                    
                    <Button variant="outlined" size ="small" color="primary" onClick={handleLogin} >LOGIN</Button>
            </div>
        </form>

    )
    
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        successMessage: state.auth.successMessage,
        showLoading: state.auth.showLoading,
    };
};

export default Login;
