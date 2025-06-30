const mongoose = require('mongoose');

const userShema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    teams: [{
        teamId: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
        role: { type: String, enum: ['admin', 'member'], required: true }
    }]
},
    { timestamps: true }
);

module.exports = mongoose.model('User',userShema);