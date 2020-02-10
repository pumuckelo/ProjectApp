import "./ChecklistItem.css";
import React, { createRef } from "react";

import { gql, useMutation } from "@apollo/client";

const ChecklistItem = props => {
  //sorry i wrote this code with 6 kids being around me playing with my hair
  const nameInputRef = createRef();
  const completedRef = createRef();
  const { checklistItemData, todoItemId } = props;
  const updateChecklistItemMutationString = gql`
    mutation updateChecklistItem(
      $todoItemId: ID
      $checklistItemId: String
      $checklistItemData: ChecklistItemInput
    ) {
      updateChecklistItem(
        todoItemId: $todoItemId
        checklistItemId: $checklistItemId
        checklistItemData: $checklistItemData
      )
    }
  `;

  const [updateChecklistItem, dataerrorloading] = useMutation(
    updateChecklistItemMutationString
  );

  const updateChecklistItemHandler = () => {
    if (
      nameInputRef.current.value != checklistItemData.name ||
      completedRef.current.value != checklistItemData.completed
    ) {
      if (nameInputRef.current.value != "") {
        // console.log("tried to update");
        // console.log(completedRef.current.value);
        updateChecklistItem({
          variables: {
            todoItemId: todoItemId,
            checklistItemId: checklistItemData._id,
            checklistItemData: {
              _id: checklistItemData._id,
              name: nameInputRef.current.value,
              completed: completedRef.current.checked
            }
          }
        }).catch(err => console.log(err));
      }
    }
  };

  const { checklistItem } = props;
  return (
    <div className="checklistItem" key={checklistItemData._id}>
      <input
        onChange={() => updateChecklistItemHandler()}
        ref={completedRef}
        value={checklistItemData.completed}
        checked={checklistItemData.completed}
        type="checkbox"
        name={checklistItemData.name}
        id=""
      />
      {/*TODO The problem with on blur and the handleclick function is that if someone changes the name of a checklist item and then clicks out of the checklist, the updatechecklist item does not get executed */}
      <input
        onBlur={() => updateChecklistItemHandler()}
        ref={nameInputRef}
        className="hidden-input pg-0"
        type="text"
        defaultValue={checklistItemData.name}
      />
    </div>
  );
};

export default ChecklistItem;
