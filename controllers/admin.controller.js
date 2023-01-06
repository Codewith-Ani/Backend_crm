const userModel = require("../models/user.model");

exports.getAllUsers = async (request, response) => {
    try {
        const user_response = [];

        const user_request = {
            username: !request.query.username ? "" : request.query.username,
            userType: !request.query.userType ? "" : request.query.userType,
            userStatus: !request.query.userStatus
                ? ""
                : request.query.userStatus,
        };
        console.log(request.query.username);
        let users;
        if (
            !user_request.username &&
            !user_request.userType &&
            !user_request.userType
        )
            users = await userModel.find({});
        else {
            let users = await userModel.find({
                $or: [
                    { username: user_request.username },
                    { userType: user_request.userType },
                    { userStatus: user_request.userStatus },
                ],
            });
        }

        console.log(users);
        users.forEach((user) => {
            user_response.push({
                name: user.name,
                username: user.username,
                email: user.email,
                contact: user.contact,
                userType: user.userType,
                userStatus: user.userStatus,
                createdOn: user.createdOn,
                updatedOn: user.updatedOn,
            });
        });
        return response.status(200).send(user_response);
    } catch (error) {
        console.log(error);
    }
};

exports.updateUserAsAdmin = async (request, response) => {
    const user_request = {
        name: request.body.name,
        username: request.params.username,
        password: request.body.password,
        email: request.body.email,
        contact: request.body.contact,
        userType: request.body.userType,
        userStatus: request.body.userStatus,
    };

    if (!user_request.username)
        return response.status(403).send({
            message: "Unauthorized User",
        });

    const saved_user = await userModel.findOne({
        username: user_request.username,
    });

    if (!saved_user) {
        return response.status(404).send({
            message: "user does not exists.",
        });
    } else {
        console.log(saved_user);
    }

    const update_field = {
        name: !request.body.name ? saved_user.name : request.body.name,
        email: !request.body.email ? saved_user.email : request.body.email,
        password: !request.body.password
            ? saved_user.password
            : request.body.password,
        contact: !request.body.contact
            ? saved_user.contact
            : request.body.contact,
        userType: !request.body.userType
            ? saved_user.userType
            : request.body.userType,
        userStatus: !request.body.userStatus
            ? saved_user.userStatus
            : request.body.userStatus,
    };

    const isRecord_Updated = await userModel.updateOne(
        { username: request.params.username },
        update_field,
    );

    if (!isRecord_Updated) {
        return response.status(500).send({
            message: " Error message ",
        });
    } else {
        response.status(200).send({
            message: " Record updated successfully ",
        });
    }
};
