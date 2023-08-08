import React from 'react'
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import { useState } from 'react';

// Toggler
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { Link } from 'react-router-dom';

// import styles from  "./navbar.module.css"

import "./navbar.css"
import LeftBar from '../LeftBar/LeftBar';



const Navbar = ( {toggleMenu} ) => {

    // const [ toggle , setToggle ] = useState(false)



    // const toggleMenu =  ()=> {

    //     alert("clicked")

    //     setToggle(!toggle);
    // }


  return (
    <div className='navbar'>

    <div className="left-navbar">
        <Link to="/" style={{textDecoration:"none"}}>
            <span>SocialMedia</span>
        </Link>

        <HomeOutlinedIcon/>
        <DarkModeOutlinedIcon/>
        <GridViewOutlinedIcon/>

        <div className="search">
            <SearchOutlinedIcon/>
            <input type="text" placeholder='Search...' />
        </div>

        {/* Sidebar Mneu */}

        <MenuRoundedIcon className='menuIcon' onClick={toggleMenu} />

        {/* <MenuRoundedIcon className='menuIcon'  /> */}


        {/* <LeftBar isVisible={toggle} /> */}

    </div>


    <div className="right-navbar">
        <PersonOutlinedIcon />
        <EmailOutlinedIcon/>
        <NotificationsOutlinedIcon/>

        <div className="user">
            <img src="" alt="" srcset="" />
            <span>
                SOURA BOSE
            </span>
        </div>
    </div>
    </div>
  )
}

export default Navbar;


