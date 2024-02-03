import { useState, useEffect } from "react";
import styles from "./stories.module.css";

const Stories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/stories/allStories")
      .then((response) => response.json())
      .then((data) => setStories(data))
      .catch((error) => console.error("Error fetching stories:", error));
  }, []);

  return (
    <div className={styles.stories}>
      <div className={styles.story}>
        <img src="" alt="" />
        <span>Soura Bose</span>
        <button>
          <a href="/create_story">+</a>
        </button>
      </div>
      {stories.map((story) => (
        <div className={styles.story} key={story._id}>
          <img src={story.mediaUrl} alt="" />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;