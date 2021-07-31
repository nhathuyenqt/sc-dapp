import React from 'react';
import logo from './logo.svg';
// import {ReactComponet as Logo} 
import { connect, useDispatch } from 'react-redux';
import { useState } from 'react';

function SignUp(props) {

    let errorsObj = { name: '', password: '' };
    const [errors, setErrors] = useState(errorsObj);

    const [infoUser, setInfoUser] = useState({name:"", address:"", password:""})

    const dispatch = useDispatch();
    
    const submitHandler = e => {
        e.preventDefault();
        let error = false;
        const errorObj = { ...errorsObj };
        if (infoUser.name === '') {
            errorObj.name = 'Email is Required';
            error = true;
        }

        if (infoUser.password === '') {
            errorObj.password = 'Password is Required';
            error = true;
        }

        setErrors(errorObj);

        if (error) return;
        
        // dispatch(loadingToggleAction(true));

        // dispatch(loginAction(email, password, props.history));
        // SignUp(infoUser);
    }

    return(
        
        <form onSubmit ={submitHandler}>
            <div className ="form-inner">
                <h2> SignUp</h2>
                {(errors == false) ? (<div className="error">{errorsObj}</div>):""}           
                    <div className="form-group">
                        <label htmlFor="name">Username:</label>
                        <input type="text" name="name" id="name" onChange={e => setInfoUser({...infoUser, name:e.target.value})} value = {infoUser.name}></input>

                    </div>
                    <div className="form-group">
                        <label htmlFor="name">Password:</label>
                        <input type="pass" name="pass" id="pass"></input>
                    </div>
                    
                    <input type ="submit" value="LOGIN"/>
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

export default SignUp;
