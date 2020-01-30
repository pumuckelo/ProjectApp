import React, { useState, useRef, useEffect } from "react";
import "./Notification.css";
import ProjectInvitation from "./ProjectInvitation/ProjectInvitation";

const Notification = props => {
  // Sorry for all the code below
  const [showNotifications, setshowNotifications] = useState(false);
  const notificationNode = useRef();

  //Click handler that checks if the click is outside the notification container and then closes the notification container
  const handleClick = e => {
    console.log("click handled");
    if (notificationNode.current.contains(e.target)) {
      //if click is inside notification, do nothing
      return;
    } else {
      //if click is outside, close the notification container and remove the event listener

      setshowNotifications(false);
      document.removeEventListener("mousedown", handleClick);
    }
  };
  const toggleShowNotifications = () => {
    setshowNotifications(!showNotifications);
    //if component isnt there yet, add the eventlistener to handle click outside of the notification container
    if (!showNotifications) {
      document.addEventListener("mousedown", handleClick);
    } else {
      // if component was already there and gets dismounted now, remove the eventlistener
      document.removeEventListener("mousedown", handleClick);
    }
  };
  //I know i should have created another component for Notification or move the i element
  // out of here to the navbar and also add Notification to navbar but no time atm
  return (
    <i onClick={() => toggleShowNotifications()} className="far fa-bell bell">
      {showNotifications && (
        <div
          ref={notificationNode}
          onClick={e => {
            e.stopPropagation();
          }}
          className="notifications"
        >
          <h5>Notifications</h5>
          <ProjectInvitation />
        </div>
      )}
    </i>
  );
};

export default Notification;
