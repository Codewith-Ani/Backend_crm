const auth = require("../middleware/auth.middleware");
const ticketValidator = require("../middleware/ticket.middleware");
const ticketController = require("../controllers/tickets.controller");
module.exports = (app) => {
    /**
     * Creating a ticket
     *
     * POST  /create/tickets
     */

    app.post(
        "/create/tickets",
        [auth.verifyToken, ticketValidator.validateTicket],
        ticketController.createTicket,
    );

    /**
     * FETCHING ALL TICKETS
     */
    app.get(
        "/get_allTickets/tickets",
        [auth.verifyToken],
        ticketController.getTickets,
    );
};