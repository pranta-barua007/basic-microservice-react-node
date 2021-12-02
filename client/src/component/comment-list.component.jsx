import React from "react";


const CommentList = ({ commentsData }) => {
  const renderedComments = commentsData.map((comment) => {
    let content;
    if (comment.status === 'pending') {
      content = 'awaiting moderation'
    }
    if (comment.status === 'rejected') {
      content = 'comment was rejected';
    }
    if (comment.status === 'approved') {
      content = comment.content;
    }
    
    return <li key={comment.id}>{content}</li>;
  });

  return <ul>{renderedComments}</ul>;
};

export default CommentList;
