import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Posts from '../../components/Posts/Posts';
import styles from './home.module.css';
import Share from "../../components/Share/Share";
import Story from '../../components/Stories/Story';


const Home = () => {
  return (
    <div className='home'>
      <Story/>
      <Share/>
      <Posts/>
    </div>
  )
}

export default Home
