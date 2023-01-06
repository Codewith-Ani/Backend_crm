const ticketsModels = require("../models/tickets.models");
const userModel = require("../models/user.model");

const validateTicket = (request, response, next) => {
    if (!request.body.title) {
        return response.status(400).send({
            message: " Title of the ticket is missing ",
        });
    }

    if (!request.body.description) {
        return response.status(400).send({
            message: " Description not provided ",
        });
    }
    if (
        request.body.status != "OPEN" ||
        request.body.status != "IN_PROGRESS" ||
        request.body.status != "CLOSED"
    ) {
        return response.status(500).send({
            message: "Invalid user status",
        });
    }
    next();
};

const isEligibleToUpdate = async (request, response, next) => {
    /**
     * Write the logic to check if the calling user is eligible to
     * update the ticket.
     */
    const callingUser = await userModel.findOne({ userId: request.userId });

    const ticket = await ticketsModels.findOne({ _id: request.params.id });

    if (!ticket) {
        return response.status(400).send({
            message: "Ticket id passed is incorrect",
        });
    }

    if (callingUser.userType == "CUSTOMER") {
        if (ticket.reporter != callingUser.userId) {
            return response.status(403).send({
                message: "User is not allowed to update the ticket",
            });
        }
    } else if (callingUser.userType == "ENGINEER") {
        if (
            ticket.reporter != callingUser.userId &&
            ticket.assignee != callingUser.userId
        ) {
            return response.status(403).send({
                message: "User is not allowed to update the ticket",
            });
        }
    }

    next();
};

module.exports = {
    validateTicket: validateTicket,
    isEligibleToUpdate: isEligibleToUpdate,
};
