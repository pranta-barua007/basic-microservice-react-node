const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('combined'));

app.post('/events', async (req, res) => {
    const { type, data } = req.body;

    if (type === 'CommentCreated') {
        const status = data.content.includes('orange') ? 'rejected' : 'approved';

        await axios.post('http://localhost:4005/events', {
            type: 'CommentModerated',
            data: {
                id: data.id, 
                postId: data.postId,
                status,
                content: data.content
            }
        });
    }  
    
    return res.status(200).json({message: 'Comment moderated'});
});

app.listen(4003, () => {
    console.log('listening on 4003....');
});