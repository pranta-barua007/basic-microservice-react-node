const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const postsDB = {};

app.get('/posts', (req, res) => {
    return res.status(200).json(postsDB);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    if(type === 'PostCreated') {
        const { id, title } = data;

        postsDB[id] = { id, title, comments: [] };
    }

    if(type === 'CommentCreated') {
        const { id, content, postId } = data;

        const post = postsDB[postId];
        post.comments.push({ id, content, postId }); 
    }

    return res.status(200).json({ message: `${type} Event processed successfully` });
});

app.listen(4002, () => {
    console.log('listening on 4002...');
});