import React, { useEffect, createRef } from "react";
import "./Comments.css";
import Comment from "./Comment/Comment";
import { useMutation, gql } from "@apollo/client";

const Comments = props => {
  useEffect(() => {
    //TODO PositionComments needs to be updated
    positionComments();
  });
  const { commentsData, todoItemId } = props;
  const commentInput = createRef();

  const positionComments = () => {
    const commentsDropdownElement = document.querySelector(
      ".comments-dropdown"
    );
    const commentsDropdownElementRect = commentsDropdownElement.getBoundingClientRect();
    const parentRect = commentsDropdownElement.parentElement.getBoundingClientRect();
    console.log(parentRect);
    console.log(commentsDropdownElementRect);

    // commentsDropdownElement.style.top =
    //   parentRect.top - commentsDropdownElementRect.height + "px";
    commentsDropdownElement.style.left = "18rem";

    if (parentRect.top >= 400) {
      console.log("bigger");
      // commentsDropdownElement.style.top =
      //   parentRect.top - commentsDropdownElementRect.top + "px";
    }
  };

  const createCommentMutationString = gql`
    mutation createComment($todoItemId: ID, $content: String) {
      createComment(todoItemId: $todoItemId, content: $content)
    }
  `;

  const [createComment] = useMutation(createCommentMutationString);

  const createCommentHandler = e => {
    e.preventDefault();
    createComment({
      variables: {
        content: commentInput.current.value,
        todoItemId: todoItemId
      }
    })
      .then(() => {
        commentInput.current.value = "";
      })
      .catch(err => console.log(err));

    commentInput.current.value = "";
  };

  let commentComponents = commentsData.map(comment => {
    return <Comment key={comment._id} commentData={comment} />;
  });
  return (
    <div className="comments-dropdown">
      {commentComponents}
      {/* <input className="form-input" type="text" placeholder="New Comment" /> */}
      <form onSubmit={e => createCommentHandler(e)} action="">
        <label htmlFor="">New comment</label>
        <textarea
          required
          ref={commentInput}
          className="form-input"
          name=""
          id=""
          cols="60"
          rows="4"
          placeholder="Type new comment here.."
        ></textarea>
        <button className="btn btn-primary">Add</button>
      </form>
    </div>
  );
};

export default Comments;
