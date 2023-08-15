import React from 'react'
import Navbar from '../../components/Navbar/Navbar'
import Posts from '../../components/Posts/Posts'
import styles from './home.module.css'

const Home = () => {
  return (
    <div className='home'>
      <Posts/>
    </div>
  )
}

export default Home
