const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
    teamName: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    members: [
        {
            userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, },
            role: { type: String, enum: ['admin', 'member'], required: true, },
        },
    ],
}, {
    timestamps: true,
});

module.exports = mongoose.model('Team', teamSchema);
