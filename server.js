const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user-routes');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

mongoose.set('strictQuery', false);

mongoose.connect('mongodb://localhost/socialnetwork', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});