const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto'); 

const app = express();

app.use(cors());
app.use(express.json());

const commentsByPostIdDB = {};

app.get('/posts/:id/comments', (req, res) => res.status(200).json(commentsByPostIdDB[req.params.id] || []));
app.post('/posts/:id/comments', (req, res) => {
    const { content } = req.body;
    const { id } = req.params;
    const commentId = randomBytes(4).toString('hex');
   
    const comments = commentsByPostIdDB[id] || [];
    comments.push({ id: commentId, content });

    commentsByPostIdDB[id] = comments;

    return res.status(201).json({data: comments, message: "Success creating comment"})
});

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}....`);
});