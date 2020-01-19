import React from "react";
import "./ConfirmationPopup.css";

// props style= danger, style = primary style = success style = secondary

const ConfirmationPopup = props => {
  return (
    <div className={`confirmation-popup ${props.style}`}>
      <p> {props.message} </p>
      <div className="buttons-popup">
        <button onClick={props.cancel} className={`btn btn-secondary `}>
          No
        </button>
        <button onClick={props.confirm} className={`btn btn-${props.style}`}>
          Yes
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
