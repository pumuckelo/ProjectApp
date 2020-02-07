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

  //This function is necessary because the member Selection needs to be absolute positioned to the wrapper around the todolist,
  // otherwise it cant overflow the todolist

  //TODO Make a helper function for finding the todolist position
  const positionMemberSelection = () => {
    let memberSelectionWrapperElement = document.querySelector(
      ".memberSelectionWrapper"
    );
    let memberSelectionElement = document.querySelector(".memberSelection");
    let parent = document.querySelector(".memberSelectionWrapper")
      .parentElement;

    let triangleElement = document.querySelector(".triangle");

    let rectParent = parent.getBoundingClientRect();

    if (rectParent.top >= 400) {
      memberSelectionWrapperElement.style.top = rectParent.top - 235 + "px";
      memberSelectionElement.classList.add("above");
      triangleElement.classList.add("above");
      // memberSelectionElement.classList.add("memberSelectionAbove");
      // memberSelectionElement.classList.remove("memberSelection");
    } else {
      memberSelectionWrapperElement.style.top = rectParent.top - 60 + "px";
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    positionMemberSelection();

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
    <div ref={node} className="memberSelectionWrapper">
      <div className="triangle"></div>
      <div className="memberSelection">
        {selectableMembers}
        <i onClick={props.unassignUser} className="fas fa-ban"></i>
      </div>
    </div>
  );
};

export default MemberSelection;
