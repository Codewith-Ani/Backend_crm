const AdminController = require("../controllers/admin.controller");
const AuthController = require("../controllers/auth.controller");
const UserController = require("../controllers/user.controller");
const AuthMiddleware = require("../middleware/auth.middleware");

module.exports = (app) => {
    app.post("/auth/sign_up", AuthController.signup);

    app.post("/auth/sign_in", AuthController.signin);

    app.put(
        "/update_user/:username",
        [AuthMiddleware.verifyToken, AuthMiddleware.isAdminOrUser],
        UserController.updateUser,
    );

    app.get(
        "/admin/get_users",
        [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin],
        AdminController.getAllUsers,
    );

    app.put(
        "/admin/update_user/:username",
        [AuthMiddleware.verifyToken, AuthMiddleware.isAdmin],
        AdminController.updateUserAsAdmin,
    );
};
