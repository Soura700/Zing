import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Posts from '../../components/Posts/Posts';
import styles from './home.module.css';
import Share from "../../components/Share/Share";
import Story from '../../components/Stories/Story';
import { useTheme } from '../../Contexts/themeContext';




const Home = () => {

  const { theme } = useTheme();


  const styles = {
    backgroundColor: theme === "light" ? "#ffffff" : "#20202b",
    color: theme === "light" ? "#000000" : "#ffffff",
    // border: `1px solid ${theme === "light" ? "#e0e0e0" : "#424242"}`, 
  };

  return (
    <div className='home' style={styles}>
      <Story/>
      <Share styles={styles}/>
      <Posts styles={styles}/>
      
    </div>
  )
}

export default Home
