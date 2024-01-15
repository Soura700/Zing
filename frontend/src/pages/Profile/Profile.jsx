import styles from "./profile.module.css";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import SettingsIcon from "@mui/icons-material/Settings";
import Posts from "../../components/Posts/Posts";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [user, setUser] = useState([]);
  // const [posts , setPostData] = useState([]);
  const { userId } = useParams();

  useEffect(() => {
    async function fetchUser() {
      try {
        const userRes = await axios.get(
          "http://localhost:5000/api/auth/" + userId
        );

        console.log("Data User" + userRes.data);

        var newUser = userRes.data;

        console.log(user);
        setUser(newUser);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchUser();
  }, []);

  const [toggle, setToggle] = useState(false);

  const showSuggestedUsers = () => {
    setToggle(!toggle);
  };

  // console.log(user[0].username);

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
            {user.map((slide, index) => (
              <h1 key={index}>{slide.username}</h1>
            ))}
            <div className={styles.btn}>
              <button className={styles.btn1}>follow</button>
              <button className={styles.btn2}>
                <Link to="/message/${}" style={{ textDecoration: "none" }}>
                  message
                </Link>
              </button>
              <SettingsIcon className={styles.settings} />
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
        <div className={styles.profileFriendsContainer}>
          <div className={styles.profileFriendsHeader}>
            <h2>Your Friends</h2>
            <button onClick={showSuggestedUsers}>Add friends </button>
          </div>
          {toggle ? (
            <div className={styles.suggestedUsers}>
              <ul>
                {/* the data below is dummy data. each user class denotes a dummy data of a single user. they are pasted multiple times. modify these to insert data dynamically - anurag c 10.1.24 */}

                <div className={styles.heading}>
                  <h2>Suggested for you</h2>
                  {/* <CloseIcon onClick={closeSuggestedUsers} className={styles.closeIcon}/> */}
                </div>

                <div className={styles.users}>
                  <div className={styles.user}>
                    <div className={styles.userInfo}>
                      <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className={styles.userPic}
                      />
                      <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>

                  <div className={styles.user}>
                    <div className={styles.userInfo}>
                      <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className={styles.userPic}
                      />
                      <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>

                  <div className={styles.user}>
                    <div className={styles.userInfo}>
                      <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className={styles.userPic}
                      />
                      <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>

                  <div className={styles.user}>
                    <div className={styles.userInfo}>
                      <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className={styles.userPic}
                      />
                      <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>

                  <div className={styles.user}>
                    <div className={styles.userInfo}>
                      <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className={styles.userPic}
                      />
                      <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>

                  <div className={styles.user}>
                    <div className={styles.userInfo}>
                      <img
                        src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                        alt=""
                        className={styles.userPic}
                      />
                      <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                      <button className={styles.btn1}>Follow</button>
                      <button className={styles.btn2}>Dismiss</button>
                    </div>
                  </div>
                </div>
              </ul>
            </div>
          ) : (
            <div className={styles.postOpt}></div>
          )}
          <div className={styles.profileFriends}>
            {/* friendcard div means particular friend's profile card  */}
            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>
            {/* upto this one particular friend's profile card ends */}

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>

            <div className={styles.friendCard}>
              <div className={styles.cardImg}>
                <img
                  src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
                  alt=""
                  className={styles.friendPic}
                />
              </div>
              <div className={styles.cardName}>
                <h3>John Doe</h3>
              </div>
            </div>
          </div>
        </div>

        {/* Post will be here */}
        <Posts />
      </div>
    </div>
  );
};

export default Profile;
