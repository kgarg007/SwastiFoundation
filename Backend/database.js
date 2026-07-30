const mongoose = require('mongoose');
const dns = require('dns');

const main = async () => {
    try {
        dns.setServers(['8.8.8.8', '8.8.4.4']);
    } catch (e) {
        console.warn("Failed to set DNS servers:", e.message);
    }

    let mongoUrl = process.env.MONGODB_URL || '';
    if (mongoUrl) {
        mongoUrl = mongoUrl.replace(/([^:]\/)\/+/g, '$1');
    }

    try {
        if (mongoUrl) {
            await mongoose.connect(mongoUrl, { serverSelectionTimeoutMS: 5000 });
            console.log("Connected to MongoDB Atlas cloud database");
            return;
        }
    } catch (atlasErr) {
        console.warn("\n⚠️ Could not connect to MongoDB Atlas cloud cluster.");
        console.warn("  Reason:", atlasErr.message);
        console.warn("  Tip: Add your current IP address to the MongoDB Atlas IP Whitelist (Network Access -> Add IP Address -> 0.0.0.0/0 for access anywhere).");
        console.warn("  Falling back to local MongoDB server...\n");
    }

    const localUrl = 'mongodb://127.0.0.1:27017/SwastiFoundation';
    try {
        await mongoose.connect(localUrl, { serverSelectionTimeoutMS: 5000 });
        console.log("Connected to local MongoDB database (" + localUrl + ")");
    } catch (localErr) {
        console.error("❌ Failed to connect to both Atlas and local MongoDB.");
        throw localErr;
    }
}

module.exports = main;