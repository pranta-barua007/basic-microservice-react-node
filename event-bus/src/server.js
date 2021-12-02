const express = require('express');
const axios = require('axios');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('combined'));

const eventsDB = [];

app.post('/events', (req, res) => {
    const event = req.body;

    eventsDB.push(event);

    axios.post('http://localhost:4000/events', event); // posts service
    axios.post('http://localhost:4001/events', event); // comments service
    axios.post('http://localhost:4002/events', event); // query service
    axios.post('http://localhost:4003/events', event); // comment moderation service
   
    return res.status(200).json({ status: 'ok' });
});

app.get('/events', (req, res) => {
    return res.status(200).json(eventsDB);
});

app.listen(4005, () => {
    console.log('event-bus service listenting in 4005....');
})