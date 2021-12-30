const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const postsDB = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated') {
        const { id, title } = data;

        postsDB[id] = { id, title, comments: [] };
    }

    if(type === 'CommentCreated') {
        const { id, content, postId, status } = data;

        const post = postsDB[postId];
        post.comments.push({ id, content, postId, status }); 
    }

    if (type === 'CommentUpdated') {
        const { id, content, postId, status } = data;

        const post = postsDB[postId];
        const comment = post.comments.find(comment => comment.id === id);

        comment.status = status;
        comment.content = content;
    }

    return;
}

app.get('/posts', (req, res) => {
    return res.status(200).json(postsDB);
});

app.post('/events', (req, res) => {
    const {type, data} = req.body;

    handleEvent(type, data);

    return res.status(200).json({ message: `${type} Event processed successfully` });
});

app.listen(4002, async () => {
    console.log('query service listening on 4002...');

    const res = await axios.get('http://event-bus-srv:4005/events');

    if(res.data.length > 0) {
        for(let event of res.data) {
            console.log('Processing event:', event.type);
            handleEvent(event.type, event.data);
        }
    }
});