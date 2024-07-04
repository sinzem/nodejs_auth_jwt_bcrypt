require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRouter = require('./authRouter');

const PORT = process.env.PORT || 5000;
const PASSWORD = process.env.MONGO_PASSWORD;

const app = express();

app.use(express.json());
app.use('/auth', authRouter); 

const start = async () => {
    try {
        await mongoose.connect(`mongodb+srv://sinzem:${PASSWORD}@cluster0.vkzhlga.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
        app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start(); /* (npm start) */