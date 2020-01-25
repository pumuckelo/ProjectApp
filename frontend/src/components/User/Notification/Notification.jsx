import React, { useState } from "react";
import "./Notification.css";
import ProjectInvitation from "./ProjectInvitation/ProjectInvitation";

const Notification = props => {
  const [showNotifications, setshowNotifications] = useState(false);

  const toggleShowNotifications = () => {
    setshowNotifications(!showNotifications);
    console.log("wurde getoggelt");
  };
  return (
    <i onClick={() => toggleShowNotifications()} class="far fa-bell bell">
      {showNotifications && (
        <div
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
