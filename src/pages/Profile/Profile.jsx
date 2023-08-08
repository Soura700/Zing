import styles from  "./profile.module.css";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/Posts/Posts"


const Profile = () => {
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
          <div className={styles.left}>
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
          <div className={styles.center}>
            <span>Jane Doe</span>
            <div className={styles.info}>
              <div className={styles.item}>
                <PlaceIcon />
                <span>USA</span>
              </div>
              <div className={styles.item}>
                <LanguageIcon />
                <span>lama.dev</span>
              </div>
            </div>
            <button>follow</button>
          </div>
          <div className={styles.right}>
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        {/* Post will be here */}
      <Posts/>
      </div>
    </div>
  );
};

export default Profile;