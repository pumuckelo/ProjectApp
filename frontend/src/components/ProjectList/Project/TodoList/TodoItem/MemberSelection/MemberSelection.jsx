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

  const selectParentElement = () => {
    let memberSelectionElement = document.querySelector(".memberSelection");
    let parent = document.querySelector(".memberSelection").parentElement;

    let rectMemberSelection = memberSelectionElement.getBoundingClientRect();

    let rectParent = parent.getBoundingClientRect();

    console.log(rectParent);
    console.log(rectMemberSelection);

    // parent.style.backgroundColor = "green";
    // document.querySelector(".assignedUser").style.backgroundColor = "green";
    // memberSelectionElement.style.left = rectParent.left;

    if (rectParent.top >= 400) {
      memberSelectionElement.style.top = rectParent.top - 235 + "px";
      memberSelectionElement.classList.add("memberSelectionAbove");
      memberSelectionElement.classList.remove("memberSelection");
      // memberSelectionElement.style.backgroundColor = "green";
    } else {
      memberSelectionElement.style.top = rectParent.top - 60 + "px";
    }

    // console.log(memberSelectionElement.getBoundingClientRect());
    // console.log(rect);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    selectParentElement();

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
      <div className="triangle"></div>
      {selectableMembers}
      <i onClick={props.unassignUser} className="fas fa-ban"></i>
    </div>
  );
};

export default MemberSelection;
