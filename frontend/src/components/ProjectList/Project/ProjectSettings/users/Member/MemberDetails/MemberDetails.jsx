import React, { useRef, useEffect } from "react";
import "./MemberDetails.css";
import { useMutation } from "@apollo/client";

const MemberDetails = props => {
  const node = useRef();

  const handleClick = e => {
    if (node.current.contains(e.target)) {
      // if click is inside component, do nothing
      return;
    } else {
      props.toggleMemberDetails();
    }
  };

  useEffect(() => {
    //add event listener when component is mounted
    document.addEventListener("mousedown", handleClick);

    //remove event listener when component is unmounted
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  return (
    <div
      ref={node}
      onClick={e => e.stopPropagation()}
      className="member-details"
    >
      {props.isOwner ? (
        <button className="btn btn-danger-inverted">Remove ownership</button>
      ) : (
        <button className="btn btn-secondary">Make owner</button>
      )}
      <button className="btn btn-danger">Remove</button>
    </div>
  );
};

export default MemberDetails;
