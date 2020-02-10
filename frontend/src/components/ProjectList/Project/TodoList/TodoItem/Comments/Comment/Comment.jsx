import React from "react";
import "./Comment.css";
import {
  convertIsoStringToLocalDateString,
  convertMongoDateToIsoDate
} from "../../../../../../../helpers/dateFunctions";

const Comment = props => {
  const { commentData } = props;
  console.log(commentData);

  return (
    <div className="comment">
      <p className="comment-content"></p>
      {commentData.content}
      <div className="flex">
        <p className="comment-author">{commentData.author.username}</p>
        <p className="comment-date ">
          {convertIsoStringToLocalDateString(
            convertMongoDateToIsoDate(commentData.created)
          )}
        </p>
      </div>
    </div>
  );
};

export default Comment;
