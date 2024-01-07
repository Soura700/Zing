import React, { useState } from 'react';
import './YourComponent.css'; // Import your CSS file

const YourComponent = () => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  
  const handleOptionClick = (index) => {
    const updatedOptions = [...selectedOptions];
    updatedOptions[index] = !updatedOptions[index];
    setSelectedOptions(updatedOptions);
  };

  const handleConfirmClick = () => {
    const selectedCount = selectedOptions.filter((option) => option).length;

    if (selectedCount >= 2) {
      // Perform actions for confirming the choices
      alert('Confirmed!');
    } else {
      alert('Please select two or more choices');
    }
  };

  return (
    <div className='Yourcomponentbody'>
      <header>
        <h1>Hi John Doe,</h1>
        <h2>Personalize your Profile</h2>
      </header>
      <section id="profile">
      <div id="profilePic">
            <h2>Setup your profile picture</h2>
            <img src="" alt=""/>
            <span></span>
        </div>
        <div id="profileBio">
            <input type="text" name="" id="" placeholder="Write about yourself"/>
        </div>
      </section>
      <div id="interests">
        <h2>Tell us more about your interests</h2>
        <h4>Pick 2 or more of what you like</h4>
        <div id="interestsList">
          <ul>
            {['Art', 'Photography', 'Travelling', 'Gym', 'Reading', 'Coding', 'Gaming', 'Food', 'Yoga', 'Singing', 'Design', 'Football', 'Cricket', 'Tennis', 'Basketball'].map((interest, index) => (
              <li
                key={index}
                className={selectedOptions[index] ? 'selected' : ''}
                onClick={() => handleOptionClick(index)}
              >
                {interest}
              </li>
            ))}
          </ul>
        </div>
        <div id="btn">
          <button type="button" id="ConfirmBtn" onClick={handleConfirmClick}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default YourComponent;
