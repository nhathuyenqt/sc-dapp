import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { SidebarData } from './SidebarData';
import './Navbar.css';
import { useHistory } from 'react-router-dom';
import { IconContext } from 'react-icons';
import {Typography, Button,  TextField} from '@material-ui/core'
import { makeStyles } from "@material-ui/core";
import { useAuth } from "../helper/AuthContext"

const style = makeStyles({
  button: {
    color: "white",
    backgroundColor: '#060b26',
    // top: "50%",
    // height: 30,
    // float: "right",
    // position: "relative",
    // transform: "translateY(-50%)"
  }
});

function Navbar() {

  const [sidebar, setSidebar] = useState(false);

  const showSidebar = () => setSidebar(!sidebar);
  const classes = style();
  const [title, setTitle] = useState("Main");

  const {logout, currentUser} = useAuth()
  let history = useHistory()
  async function handleLogout() {
    // setError("")

    try {
      await logout()
      history.push("/login")
    } catch {
      // setError("Failed to log out")
    }
  }
  
  return (
    <>
      <IconContext.Provider value={{ color: '#666' }}>
        <div style={{display: 'flex', "align-items":'center', backgroundColor: '#060b26'}}>
          <div className='navbar'>
           
            <Link to='#' className='menu-bars'>
              <FaIcons.FaBars onClick={showSidebar}  />
              
            </Link>

          </div>
          <div>
            <Typography style={{color:"white"}} gutterBottom variant = "subtitle1">{currentUser.email}</Typography>
            <Button style={{width:'150px'}}  size ="small" color='primary' className={classes.button} onClick={handleLogout} >LOG OUT</Button>
          </div>
        </div>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className='nav-menu-items' onClick={showSidebar}>
            <li className='navbar-toggle'>
              <Link to='#' className='menu-bars'>
                <AiIcons.AiOutlineClose />
              </Link>
              <h1 style={{float: 'right'}} >{title}</h1> 
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;