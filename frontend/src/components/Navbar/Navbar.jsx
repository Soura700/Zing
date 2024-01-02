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

// import "./navbar.css"
import styles from "./navbar.module.css"



const Navbar = ( {toggleMenu} ) => {



    const [ toggle , setToggle ] = useState(false)



    const handleToggle =  ()=> {
        setToggle(!toggle);
    }


  return (
    <div className={styles.navbar}>

    <div className={styles.left_navbar}>
        <Link to="/" style={{textDecoration:"none"}}>
            <span className={styles.title}>SocialMedia</span>
        </Link>

        <HomeOutlinedIcon className={styles.icon}/>
        <DarkModeOutlinedIcon className={styles.icon}/>
        <GridViewOutlinedIcon className={styles.icon}/>

        <div className={styles.search}>
            <SearchOutlinedIcon className={styles.icon} onClick={handleToggle}/>
            {toggle?<input type="text" placeholder='Search...' className={styles.extended} /> : <input type="text" placeholder='Search...' className={styles.default} />}
        </div>

        {/* Sidebar Mneu */}

        <MenuRoundedIcon className={styles.menuIcon} onClick={toggleMenu} />

        {/* <MenuRoundedIcon className='menuIcon'  /> */}


        {/* <LeftBar isVisible={toggle} /> */}

    </div>


    <div className={styles.right_navbar}>
        <PersonOutlinedIcon />
        <EmailOutlinedIcon/>
        <NotificationsOutlinedIcon/>

        <div className={styles.user}>
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


