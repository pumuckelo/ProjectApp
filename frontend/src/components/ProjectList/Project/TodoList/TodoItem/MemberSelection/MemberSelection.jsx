import React, { useRef, useEffect } from "react";
import { useProjectData } from "../../../Project";
import "./MemberSelection.css";

const MemberSelection = props => {
  const { members } = useProjectData();
  const node = useRef();

  const handleClick = e => {
    if (!node.current.contains(e.target)) {
      // if click is outside div, close memberSelection
      props.closeMemberSelection();
    } else {
      // else do nothing
      return;
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);

    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  let selectableMembers = members.map(member => {
    return (
      <div
        onClick={() => props.assignUser(member._id)}
        key={member._id}
        className="selectableMember"
      >
        {member.username}
      </div>
    );
  });

  return (
    <div ref={node} className="memberSelection">
      {selectableMembers}
      <p>Unassign</p>
    </div>
  );
};

export default MemberSelection;
