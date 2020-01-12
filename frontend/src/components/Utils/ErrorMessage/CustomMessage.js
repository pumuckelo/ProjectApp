import React from "react";
import "./CustomMessage.css";

const CustomMessage = props => {
  return <div className={`customMessage ${props.color}`}>{props.message}</div>;
};

export default CustomMessage;
