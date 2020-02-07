import React, { useEffect } from "react";
import "./Checklist.css";

const Checklist = () => {
  useEffect(() => {
    positionChecklist();
  }, []);

  const positionChecklist = () => {
    //get the ChecklistDropdown
    const checklistDropdownElement = document.querySelector(
      ".checklist-dropdown"
    );

    //get the coordinates of the div around checklistDropdown in todoitem.jsx, its .checklist
    //then we can position the checklistdropdown near to the icon.
    // we have to do it because the dropdown is absolute positioned to the todolist wrapper so it can overflow the todolist
    const parentRect = checklistDropdownElement.parentElement.getBoundingClientRect();

    checklistDropdownElement.style.top = parentRect.top - 120 + "px";
    checklistDropdownElement.style.left = "17rem";

    console.log(parentRect);
  };
  return (
    <div className="checklist-dropdown">
      {/* checklistitems */}
      Checklist
    </div>
  );
};

export default Checklist;
