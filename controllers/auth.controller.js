const bcrypt = require("bcryptjs");
const userModel = require("../models/user.model");
const userSchema = require("../models/user.model");
const jsonWebToken = require("jsonwebtoken");
const secret_code = require("../utils/secret_code");

exports.signup = async (request, response) => {
    // GET USER DATA FROM REQUEST

    const user_details = {
        name: request.body.name,
        username: request.body.username,
        password: bcrypt.hashSync(request.body.password, 10),
        email: request.body.email,
        contact: request.body.contact,
        userType: request.body.userType,
    };

    if (!user_details.userType || user_details.userType == "CUSTOMER")
        user_details.userStatus = "APPROVED";
    else user_details.userStatus = "PENDING";

    // WRITE TO DATABASE
    try {
        const saved_data = await userSchema.create(user_details);
    } catch (error) {
        return response.status(400).send({
            message: "User already exists. Kindly Sign In",
        });
    }

    //RETURN RESPONSE
    const user_response = {
        name: saved_data.name,
        username: saved_data.username,
        email: saved_data.email,
        contact: saved_data.contact,
        userType: saved_data.userType,
        userStatus: saved_data.userStatus,
    };

    console.log(user_response);
    response.status(200).send({
        message: "Sign up successful",
    });
};

exports.signin = async (request, response) => {
    //GET EMAIL/USERNAME FROM REQUEST

    const user_request = {
        username: !request.body.username ? "" : request.body.username,
        email: !request.body.email ? "" : request.body.email,
        password: request.body.password,
    };
    if (user_request.username == "" && user_request.email == "") {
        return response.status(400).send({
            message: "Username or email required",
        });
    }

    //CHECK AND RETRIVE INFORMATION FROM DATABASE
    const saved_user = await userModel.findOne({
        $or: [
            { username: user_request.username },
            { email: user_request.email },
        ],
    });
    if (!saved_user) {
        return response.status(400).send({
            message: "Invalid username",
        });
    }
    const isValidPassword = bcrypt.compareSync(
        user_request.password,
        saved_user.password,
    );
    if (!isValidPassword) {
        return response.status(400).send({
            message: "Invalid Password",
        });
    }
    if (saved_user.userStatus == "PENDING") {
        return response.status(403).send({
            message: "WAITING FOR ACCOUNT APPROVAL",
        });
    }

    // GENERATE TOKEN
    const token = jsonWebToken.sign(
        { id: saved_user.username },
        secret_code.CODE,
        {
            expiresIn: 600,
        },
    );

    const user_response = {
        name: saved_user.name,
        username: saved_user.username,
        email: saved_user.email,
        userStatus: saved_user.userStatus,
        userType: saved_user.userType,
        accessToken: token,
    };
    return response.status(200).send(user_response);
};
