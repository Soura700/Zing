import React from 'react';
import styles from  "./rightbar.module.css";

const RightBar = () => {
  return (
    <div className={styles.RightBar}>
        <div className={styles.container}>
            {/* box1 content starts here */}
            <div className={styles.item}>
                <h1 className={styles.header}>Suggestions For You</h1>
                <div className={styles.user}>
                    <div className={styles.userInfo}>
                        {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.btn1}>Follow</button>
                        <button className={styles.btn2}>Dismiss</button>
                    </div>
                </div>
                <div className={styles.user}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                    </div>
                    <div className={styles.buttons}>
                        <button className={styles.btn1}>Follow</button>
                        <button className={styles.btn2}>Dismiss</button>
                    </div>
                </div>
            </div>
            {/* box1 content ends here */}

            {/* box2 content starts here */}
            <div className={styles.item2}>
                <h1 className={styles.header}>Latest Activities</h1>
                <div className={styles.user2}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                    </div>
                    <p>changed their cover picture</p>
                </div>
                <div className={styles.user3}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                    </div>
                    <p>liked a post</p>
                </div>
                <div className={styles.user4}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                    </div>
                    <p>commented on your post</p>
                </div>
                <div className={styles.user5}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                    </div>
                    <p>shared a post</p>
                </div>
                <div className={styles. more}>More</div>
            </div>
            {/* box2 content ends here */}

            {/* box3 content starts here */}
            <div className={styles.item3}>
                <h1 className={styles.header}>Online Friends</h1>
                <div className={styles.user6}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                        <circle></circle>
                    </div>
                </div>
                <div className={styles.user7}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                        <circle></circle>
                    </div>
                </div>
                <div className={styles.user8}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                        <circle></circle>
                    </div>
                </div>
                <div className={styles.user9}>
                    <div className={styles.userInfo}>
                    {/* <img src={Img} alt="user" height="40px" width="40px"/> */}
                        <h3>John Doe</h3>
                        <circle></circle>
                    </div>
                </div>
            </div>
            {/* box3 content ends here */}
            
        </div>
     </div>
  )
}

export default RightBar
