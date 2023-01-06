//RETURN ALL USERS
const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs");

exports.updateUser = async (request, response) => {
    //CHECK USERBODY
    try {
        const get_user = {
            username: request.params.username,
        };
        console.log();
        const find_user = await userModel.findOne({
            username: get_user.username,
        });

        if (!request.body.password) {
            update_field = {
                name: !request.body.name ? find_user.name : request.body.name,
                contact: !request.body.contact
                    ? find_user.contact
                    : request.body.contact,
            };
        } else {
            update_field = {
                name: !request.body.name ? find_user.name : request.body.name,
                password: bcrypt.hashSync(request.body.password, 10),
                contact: request.body.contact,
            };
        }

        const saved_user = await userModel.updateOne(get_user, update_field);
        console.log(saved_user);
        if (saved_user)
            return response.status(200).send({
                message: "Record Updated",
            });
    } catch (error) {
        console.log(error);
    }
};
