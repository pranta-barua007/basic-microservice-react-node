const express = require('express');
const cors = require('cors');
const { randomBytes } = require('crypto'); 

const app = express();

app.use(cors());
app.use(express.json());

const postsDB = {};

app.get('/posts', (req, res) => res.status(200).json(postsDB));
app.post('/posts', (req, res) => {
    const { title } = req.body;
    const id = randomBytes(4).toString('hex');
    postsDB[id] = {id, title};

    return res.status(201).json({data: {id, title}, message: "Success creating post"})
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`listening on ${PORT}....`);
});