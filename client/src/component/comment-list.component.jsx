import React from "react";


const CommentList = ({ commentsData }) => {
  const renderedComments = commentsData.map((comment) => {
    return <li key={comment.id}>{comment.content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
