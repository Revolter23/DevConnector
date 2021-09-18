const express = require('express');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(express.json({extended: true}));

app.get('/', (req, res) => res.send('hello world'));

app.use('/api/users', require('./route/api/users'));
app.use('/api/profile', require('./route/api/profile'));
app.use('/api/posts', require('./route/api/posts'));
app.use('/api/auth', require('./route/api/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, (req, res) => console.log(`listening on port ${PORT}`));