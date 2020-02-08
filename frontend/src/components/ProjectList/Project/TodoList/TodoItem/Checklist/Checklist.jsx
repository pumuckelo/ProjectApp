import React, { useEffect, useRef } from "react";
import { useMutation, gql } from "@apollo/client";
import "./Checklist.css";
import { createRef } from "react";
import ChecklistItem from "./ChecklistItem/ChecklistItem";

const Checklist = props => {
  const { checklistData, todoItemId } = props;
  const checklistItemInput = createRef();

  const node = createRef();
  useEffect(() => {
    positionChecklist();

    //Event listeners for detecting if click was outside the checklist
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  });

  const handleClick = event => {
    //prevent some weird bug
    if (!node.current) {
      return;
    }
    //check if click is inside checklist or outside
    if (!node.current.contains(event.target)) {
      props.closeChecklist();
    } else {
    }
  };

  const createChecklistItemMutationString = gql`
    mutation createChecklistItem($todoItemId: ID, $name: String) {
      createChecklistItem(todoItemId: $todoItemId, name: $name)
    }
  `;

  const [
    createChecklistItem,
    { loading: createChecklistItemLoading, error: createChecklistItemError }
  ] = useMutation(createChecklistItemMutationString);

  const positionChecklist = () => {
    //get the ChecklistDropdown
    const checklistDropdownElement = document.querySelector(
      ".checklist-dropdown"
    );

    const checklistDropdownElementRect = checklistDropdownElement.getBoundingClientRect();
    //get the coordinates of the div around checklistDropdown in todoitem.jsx, its .checklist
    //then we can position the checklistdropdown near to the icon.
    // we have to do it because the dropdown is absolute positioned to the todolist wrapper so it can overflow the todolist
    const parentRect = checklistDropdownElement.parentElement.getBoundingClientRect();

    //change the position, if the checklist gets bigger
    // if the (parentRect.top - checklistDropdownElementRect.height) value is >= parentRect.top - 130 then parentRect.top - checklistDropdownElementRect.height
    checklistDropdownElement.style.top =
      parentRect.top - checklistDropdownElementRect.height <=
      parentRect.top - 130
        ? parentRect.top - checklistDropdownElementRect.height + "px"
        : parentRect.top - 130 + "px";

    //if the checklist is near the right end of the screen the checklist should be displayed left of the icon
    // if left is >900, then change to 850 and later also change the styling of the triangle on the side
    if (checklistDropdownElementRect.left > 1000) {
      checklistDropdownElement.style.left = "-1rem";
    } else {
      checklistDropdownElement.style.left = "15rem";
    }
    console.log(checklistDropdownElementRect.left);
  };

  let checklistItems = checklistData.map(checklistItem => {
    return (
      // <div className="checklistItem" key={item._id}>
      //   <input value={item.completed} type="checkbox" name={item.name} id="" />
      //   <input className="hidden-input pg-0" type="text" value={item.name} />
      // </div>

      <ChecklistItem
        key={checklistItem._id}
        todoItemId={todoItemId}
        checklistItemData={checklistItem}
      />
    );
  });

  const toggleCompletedHandler = () => {};

  const addCheckListItemHandler = event => {
    event.preventDefault();
    console.log(checklistItemInput.current.value);
    createChecklistItem({
      variables: {
        todoItemId: todoItemId,
        name: checklistItemInput.current.value
      }
    })
      .then(() => positionChecklist())
      //   .then(() => document.addEventListener("mousedown", handleClick))
      .catch(err => console.log(err));
  };
  return (
    <>
      <div className="background"></div>
      <div ref={node} className="checklist-dropdown">
        {/* checklistitems */}
        {createChecklistItemLoading ? (
          "Loading"
        ) : (
          <form onSubmit={event => addCheckListItemHandler(event)} action="">
            <input
              ref={checklistItemInput}
              className="form-input"
              required
              placeholder="Add item"
              type="text"
            />
          </form>
        )}
        {checklistItems}
      </div>
    </>
  );
};

export default Checklist;
