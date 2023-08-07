/* eslint-disable no-undef */
const mongoose = require('mongoose');
const mongoURI = 'Enter your mongo url here';

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
    }
};

module.exports = connectToMongo;
