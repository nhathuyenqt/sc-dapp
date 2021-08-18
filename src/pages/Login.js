import React from 'react';
import logo from './logo.svg';
// import {ReactComponet as Logo} 
import { connect, useDispatch } from 'react-redux';
import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import PersonPinCircleRoundedIcon from '@material-ui/icons/PersonPinCircleRounded';
import { useAuth } from "../helper/AuthContext"
import { useState } from 'react';
import {useHistory} from 'react-router-dom';
import {Typography, Button} from '@material-ui/core'
import './Login.css';

function Login(props) {
    
    const emails = ["alex@rinkeby.com", "local3@test.com", "test2@gmail.com", "local1@gmail.com", "local2@test.com", "rinkeby1@test.com"]
    const [errorsObj, setErrorObj]= useState('');
    const [errors, setErrors] = useState(errorsObj);
    const [infoUser, setInfoUser] = useState({email:"", password:""})
    const dispatch = useDispatch();
    
    const {login, loading} = useAuth()
    let history = useHistory()

    async function handleLogin() {
        if (infoUser.email === '') {
            setErrorObj('Email is Required');
        }else{
            if (infoUser.password === '') {
                setErrorObj('Password is Required');
            }else{
                try {
                    console.log(infoUser);
                    await login(infoUser.email, infoUser.password)
                    if (loading === false)
                        history.push("/")
                } catch {
                    setErrorObj("Failed to log out");
                }
            }

        }
    }

    async function handleListItemClick(value){
        
        setInfoUser({email: value, password:"123456"});
        // console.log("1  ", infoUser, value);
        // handleLogin();
      };
    
    

    return(
        <div>   
        <form >
            <div className ="form-inner">
                <h2> Login</h2>
                {(errors === false) ? (<div className="error">{errorsObj}</div>):""}           
                    <div className="form-group">
                        <label htmlFor="name">Email:</label>
                        <input type="text" name="email" id="email" onChange={e => setInfoUser({...infoUser, email:e.target.value})} value = {infoUser.email}></input>

                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Password:</label>
                        <input type="password" name="password" id="password" onChange={e => setInfoUser({...infoUser, password:e.target.value})} value = {infoUser.password}></input>
                    </div>
                    
                    <Button variant="outlined" size ="small" color="primary" onClick={handleLogin} >LOGIN</Button>
            </div>
        </form>
        <div>
            {emails.map((ev) => (
          <ListItem button onClick={() => handleListItemClick(ev)} key={ev}>
            <ListItemAvatar>
              <Avatar >
                <PersonPinCircleRoundedIcon color="secondary" />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={ev} />
          </ListItem>
        ))}
        </div>
        </div>

    )
    
}


export default Login;
