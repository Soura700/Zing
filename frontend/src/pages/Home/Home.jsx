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
    backgroundColor: theme === "light" ? "#ffffff" : "#3d3061",
    color: theme === "light" ? "#000000" : "#ffffff",
  };

  return (
    <div className='home' style={styles}>
      <Story/>
      <Share/>
      <Posts styles={styles}/>
    </div>
  )
}

export default Home
