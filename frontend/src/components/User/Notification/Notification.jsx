import React, { useState } from "react";
import "./Notification.css";
import ProjectInvitation from "./ProjectInvitation/ProjectInvitation";

const Notification = props => {
  const [showNotifications, setshowNotifications] = useState(false);

  const toggleShowNotifications = () => {
    setshowNotifications(!showNotifications);
  };
  return (
    <i onClick={() => toggleShowNotifications()} class="far fa-bell bell">
      {showNotifications && (
        <div className="notifications">
          <ProjectInvitation />
        </div>
      )}
    </i>
  );
};

export default Notification;
