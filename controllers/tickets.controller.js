const ticketModel = require("../models/tickets.models");
const userModel = require("../models/user.model");
/**
 * CREATING TICKETS
 */
/** 1. USER IS AUTHENTICATED  - VERIFYTOKEN MIDDLEWARE
 * REQUEST BODY IS VALID - MIDDLEWARE
 * INSERT THE TICKET BODY
 */
exports.createTicket = async (request, response) => {
    const request_object = {
        title: request.body.title,
        ticketPriority: request.body.ticketPriority,
        description: request.body.description,
        reporter: request.userId,
    };

    /**
     * 2. GET ENGINEER TO THIS TICKET
     */
    const engineer = await ticketModel.findOne({
        userType: "ENGINEER",
        userStatus: "APPROVED",
    });

    if (engineer) {
        request_object.assignedTo = engineer.userId;
    }

    const ticket_created = await ticketModel.create(request_object);

    if (ticket_created) {
        const customer = await userModel.findOne({ userId: req.userId });

        customer.ticketsCreated.push(ticketCreated._id);
        await customer.save();
    }
    if (engineer) {
        engineer.ticketAssigned.push(ticketCreated._id);
        await engineer.save();
    }
};

exports.getTickets = async (req, res) => {

    try {
        /**
         * FETCH USER DETAILS FOR WHO IS MAKING THE CALL
         */

        const userId = req.userId;
        const callingUserObj = await userModel.findOne({ userId: userId });

        const queryObj = {};

        /**
         * QUERY BASED ON USER 
         */
        if (callingUserObj.userType == "CUSTOMER") {
            queryObj.reporter = req.userId;
        } else if (callingUserObj.userType == "ENGINEER") {

            queryObj.$or = [{ reporter: req.userId }, { assignee: req.userId }];
            console.log(queryObj);
        }

        /**
         * RETRIVE RESULT
         */
        const tickets = await ticketModel.find(queryObj);

        return res.status(200).send(tickets);
    } catch (err) {
        console.log("Error while fetching tickets ", err.message);
        res.status(500).send({
            message: "Internal server error"
        })
    }

}