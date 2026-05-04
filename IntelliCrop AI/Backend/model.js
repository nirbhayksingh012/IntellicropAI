// models.js
const mongoose = require('mongoose');

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // hashed password
    createdAt: { type: Date, default: Date.now }
});

// Soil Sample Schema
const soilSampleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    location: { type: String, required: true },
    nitrogen: { type: Number, required: true },
    phosphorus: { type: Number, required: true },
    potassium: { type: Number, required: true },
    ph: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

// Recommendation Schema
const recommendationSchema = new mongoose.Schema({
    soilSampleId: { type: mongoose.Schema.Types.ObjectId, ref: 'SoilSample', required: true },
    crops: [String], // recommended crops
    fertilizer: String,
    plantingSchedule: String,
    generatedAt: { type: Date, default: Date.now }
});

// Weather Log Schema (Optional: store historical weather)
const weatherLogSchema = new mongoose.Schema({
    location: { type: String, required: true },
    temperature: Number,
    humidity: Number,
    weather: String,
    date: { type: Date, default: Date.now }
});

// Export models
module.exports = {
    User: mongoose.model('User', userSchema),
    SoilSample: mongoose.model('SoilSample', soilSampleSchema),
    Recommendation: mongoose.model('Recommendation', recommendationSchema),
    WeatherLog: mongoose.model('WeatherLog', weatherLogSchema)
};
