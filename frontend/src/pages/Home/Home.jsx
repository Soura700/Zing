import React from 'react';
import Navbar from '../../components/Navbar/Navbar';
import Posts from '../../components/Posts/Posts';
import styles from './home.module.css';
import Stories from '../../components/Stories/Stories';
import Share from "../../components/Share/Share";

const Home = () => {
  return (
    <div className='home'>
      <Stories/>
      {/* <Share/> */}
      <Posts/>
    </div>
  )
}

export default Home
