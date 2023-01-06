const express = require("express");
const app = express();
const mongoose = require("mongoose");
const db_config = require("./configs/db_config");
const bcrypt = require("bcryptjs");
const serverConfig = require("./configs/serverConfigs");
const userModel = require("./models/user.model");

//CONNECTING JSON
app.use(express.json());

//PLUGIN ROUTER
require("./routes/user.routes")(app);
require("./routes/tickets.routes")(app);

/** DB CONFIG */
mongoose.set("strictQuery", false);
mongoose.connect(db_config.DB_URL);
const dbconnection = mongoose.connection;

dbconnection.on("Error", (err) => {
    console.log(err);
});

dbconnection.once("open", () => {
    console.log("Database connection successful");
});

/*CREATE ADMIN

const createAdmin = async (request, response) => {
    const adminUser = {
        name: "Bruce",
        username: "wayne123",
        password: bcrypt.hashSync("wayne_123", 10),
        email: "wayne123@gmail.com",
        userType: "ADMIN",
        userStatus: "APPROVED",
    };
    const Admin_user = await userModel.create(adminUser);
    if (Admin_user) console.log("Admin User Created");
};
createAdmin();*/

/** SERVER START */
app.listen(serverConfig.PORT, () => {
    console.log(`Server started on port ${serverConfig.PORT}`);
});
