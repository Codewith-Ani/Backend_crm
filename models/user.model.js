const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        validate: {
            validator: function (mail) {
                var regex_pattern = /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9+_.-]+$/;
                return regex_pattern.test(mail);
            },
            message: "Invalid Email ID",
        },
    },
    contact: {
        type: String,
        maxlength: 10,
        minlength: 10,
    },
    createdAt: {
        type: Date,
        immutable: true,
        default: () => {
            return Date.now();
        },
    },
    updatedOn: {
        type: Date,
        default: () => {
            return Date.now();
        },
    },
    userType: {
        type: String,
        required: true,
        enum: ["CUSTOMER", "ENGINEER", "ADMIN"],
        default: "CUSTOMER",
        uppercase: true,
    },
    userStatus: {
        type: String,
        requried: true,
        enum: ["APPROVED", "PENDING", "REJECTED"],
        default: "APPROVED",
        uppercase: true,
    },
    ticketsCreated: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Ticket",
    },
    ticketsAssigned: {
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Tickets",
    },
});

module.exports = mongoose.model("User", userSchema);
