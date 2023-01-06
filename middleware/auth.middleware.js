const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
const { CODE } = require("../utils/secret_code");

const verifyToken = (request, response, next) => {
    //GET TOKEN FROM REQUEST
    console.log("In Verify Token Middleware");
    let token = request.headers["x-access-token"];

    //TOKEN NOT AVAILABLE

    if (!token) {
        return response.status(403).send({
            message: "Token not provided",
        });
    }

    jwt.verify(token, CODE, (error, decoded) => {
        if (error) {
            return response.status(403).send({
                message: "Token Verification failed.",
            });
        }
        request.username = decoded.id;

        next();
    });
};

const isAdmin = async (request, response, next) => {
    const user = await userModel.findOne({ username: request.username });

    if (user && user.userType == "ADMIN") {
        next();
    } else {
        return response.status(403).send({
            message: "Access Unauthorized",
        });
    }
};

const isAdminOrUser = async (request, response, next) => {
    console.log("isAdmin or User");
    try {
        const query_param = request.params.username;

        const user = await userModel.findOne({ username: request.username });

        console.log(
            `UserType : ${user.userType} user.username: ${user.username} request.username : ${request.username} `,
        );

        if (
            user &&
            (user.userType == "ADMIN" || query_param == user.username)
        ) {
            next();
        } else {
            response.status(403).send({
                message: "Unauthorized user",
            });
        }
    } catch (error) {
        console.log(error);
    }
};
module.exports = {
    verifyToken,
    isAdmin,
    isAdminOrUser,
};
