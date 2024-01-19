import React from "react";
import Stories from "stories-react";
import "stories-react/dist/index.css";
import styles from "./stories.module.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import MessageIcon from "@mui/icons-material/Message";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";

const Story = () => {
  //TEMPORARY
  const stories = [
    {
      id: 1,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 2,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 3,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 4,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },

    {
      id: 5,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },

    {
      id: 6,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 7,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 8,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },

    {
      id: 9,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
    {
      id: 10,
      name: "John Doe",
      img: "https://images.pexels.com/photos/13916254/pexels-photo-13916254.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load",
    },
  ];

  const [showStory, setShowStory] = useState(null);
  const [selectedStory, setSelectedStory] = useState(null);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);

  const showFullStory = (story) => {
    setShowStory(!showStory);
    setSelectedStory(story);
    setSelectedStoryIndex(stories.indexOf(story));
  };

  const navigateToNextStory = (e) => {
    e.stopPropagation();
    const nextIndex = (selectedStoryIndex + 1) % stories.length;
    setSelectedStoryIndex(nextIndex);
    setSelectedStory(stories[nextIndex]);
  };

  const navigateToPreviousStory = (e) => {
    e.stopPropagation();
    const previousIndex =
      selectedStoryIndex === 0 ? stories.length - 1 : selectedStoryIndex - 1;
    setSelectedStoryIndex(previousIndex);
    setSelectedStory(stories[previousIndex]);
  };

  const [showComments, setShowComments] = useState(null);

  const openComments = (e) => {
    e.stopPropagation();
    setShowComments(!showComments);
  };

  const closeComments = (e) => {
    e.stopPropagation();
    setShowComments(false);
  };
  return (
    <div className={styles.stories}>
      <div className={styles.story} onClick={() => showFullStory(null)}>
        {showStory ? (
          <div className={styles.showFullStory}>
            {selectedStory && (
              <>
                <div className={styles.userNameStory}>
                  <img src="" alt="" />
                  <div className={styles.userHeading}>
                    <h1>{selectedStory.name}</h1>
                    <p>10 minutes ago</p>
                  </div>
                </div>
                {/* <img src={selectedStory.img} alt={selectedStory.name} className={styles.userStory}></img>/ */}
                <div className={styles.userStoryContent}>
                  <KeyboardArrowLeftIcon
                    className={styles.userStoryContentLeftOpt}
                    onClick={(e) => navigateToPreviousStory(e)}
                  />
                  <Stories
                    key={selectedStory.id}
                    width="427px"
                    height="540px"
                    background="transparent"
                    stories={[
                      {
                        type: "image",
                        url: selectedStory.img,
                        duration: 5000,
                      },
                      {
                        type: "image",
                        url: selectedStory.img,
                        duration: 5000,
                      },
                      // Add more stories if needed
                    ]}
                  />
                  <KeyboardArrowRightIcon
                    className={styles.userStoryContentRightOpt}
                    onClick={(e) => navigateToNextStory(e)}
                  />
                </div>

                <div className={styles.userStoryOpt}>
                  <FavoriteBorderIcon
                    className={styles.userOpt}
                  ></FavoriteBorderIcon>
                  <MessageIcon
                    className={styles.userOpt}
                    onClick={(e) => openComments(e)}
                  />
                </div>
                {showComments ? (
                  <div
                    className={styles.storyCommentShow}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className={styles.storyCommentHeader}>
                      <h1>Comments</h1>
                      <CloseIcon
                        className={styles.closeCommentsButton}
                        onClick={(e) => closeComments(e)}
                      />
                    </div>
                    <div className={styles.storyCommentContent}>
                      <textarea
                        rows="4"
                      ></textarea>
                      <button>Post</button>
                    </div>
                  </div>
                ) : (
                  <div className={styles.storyCommentClose}></div>
                )}
              </>
            )}
          </div>
        ) : (
          <div className={styles.closeFullStory}></div>
        )}
        <img src="" alt="" />

        <span>Soura Bose</span>
        <button>+</button>
      </div>
      {stories.map((story) => (
        <div
          className={styles.story}
          key={story.id}
          onClick={() => showFullStory(story)}
        >
          <img src={story.img} alt={story.name} />
          <span>{story.name}</span>
        </div>
      ))}
    </div>
  );
};

export default Story;
