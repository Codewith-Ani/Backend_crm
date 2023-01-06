const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    ticketPriority: {
        type: Number,
        required: true,
        default: 4,
    },
    description: {
        type: String,
        required: true,
    },
    ticketStatus: {
        type: String,
        required: true,
        enum: ["OPEN", "IN PROGRESS", "CLOSED"],
        default: "OPEN",
    },
    reporter: {
        type: String,
        required: true,
    },
    assignedTo: {
        type: String,
    },
    createdAt: {
        type: Date,
        required: true,
        default: () => {
            return Date.now();
        },
        immutable: true,
    },
    updatedAt: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
});

module.exports = mongoose.model("Ticket", ticketSchema);
