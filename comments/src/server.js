const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const axios = require("axios");
const { randomBytes } = require("crypto");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("combined"));

const commentsByPostIdDB = {};

app.get("/posts/:id/comments", (req, res) =>
  res.status(200).json(commentsByPostIdDB[req.params.id] || [])
);
app.post("/posts/:id/comments", async (req, res) => {
  const { content } = req.body;
  const { id } = req.params;
  const commentId = randomBytes(4).toString("hex");

  const comments = commentsByPostIdDB[id] || [];
  comments.push({ id: commentId, content, status: "pending" });

  commentsByPostIdDB[id] = comments;

  await axios.post("http://localhost:4005/events", {
    type: "CommentCreated",
    data: {
      id: commentId,
      postId: id,
      content,
      status: "pending",
    },
  });

  return res
    .status(201)
    .json({ data: comments, message: "Success creating comment" });
});

app.post("/events", async (req, res) => {
  const { type, data } = req.body;
  console.log("Received Event", { type, data });

  if (type === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostIdDB[postId];

    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;

    await axios.post("http://localhost:4005/events", {
      type: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }

  return res.status(200).json({ type, data });
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`comment service listening on ${PORT}....`);
});
