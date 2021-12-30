const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto'); 
const morgan = require('morgan');
const axios = require('axios');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('combined'));

const postsDB = {};

app.get('/posts', (req, res) => res.status(200).json(postsDB));
app.post('/posts', async (req, res) => {
    const { title } = req.body;
    const id = randomBytes(4).toString('hex');
    postsDB[id] = {id, title};

    await axios.post('http://event-bus-srv:4005/events', {
       type: 'PostCreated',
       data: {id, title} 
    });

    return res.status(201).json({data: {id, title}, message: "Success creating post"})
});

app.post('/events', (req, res) => {
    const { type, data } = req.body;
    console.log('Received Event', {type, data});

    return res.status(200).json({type, data});
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log("v22");
    console.log(`posts service listening on ${PORT}....`);
});