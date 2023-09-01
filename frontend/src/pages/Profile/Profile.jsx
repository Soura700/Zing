import styles from  "./profile.module.css";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import SettingsIcon from "@mui/icons-material/Settings";
import Posts from "../../components/Posts/Posts"
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


const Profile = () => {


  const [ user , setUser] = useState(null);
  const [posts , setPostData] = useState([]);
  const {userId} = useParams();
  

  useEffect(() => {


    async function fetchUser() {
      try {

        const userRes = await axios.get(
          "http://localhost:5000/api/auth/" + userId
        );

       console.log("Data User" + userRes.data)
       console.log(userRes.data);

       var newUser = userRes.data;

        setPostData(newUser);
        
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUser();
  }, []);

  console.log(user);
  

  return (
    <div className={styles.profile}>
  
      <div className={styles.images}>
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className={styles.cover}
        />
        <img
          src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
          alt=""
          className={styles.profilePic}
        />
      </div>
      <div className={styles.profileContainer}>
        <div className={styles.uInfo}>

          <div className={styles.name}>
            <h1>Soura Bose</h1>
            {/* <div className={styles.info}>
              <div className={styles.item}>
                <PlaceIcon />
                <span>USA</span>
              </div>
              <div className={styles.item}>
                <LanguageIcon />
                <span>lama.dev</span>
              </div>
            </div> */}
            <div className={styles.btn}>
              <button className={styles.btn1}>follow</button>
              <button className={styles.btn2}>
                <Link to="/message" style={{textDecoration:"none"}}>
                    message
                </Link>
              </button>
              <SettingsIcon className={styles.settings}/>
              {/* <div className={styles.settings}>
                <SettingsIcon/>
              </div> */}
            </div>
          </div>

          <div className={styles.links}>
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
         
          {/* <div className={styles.right}>
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div> */}
        </div>
        {/* Post will be here */}
      <Posts/>
      </div>
    </div>
  );
};

export default Profile;