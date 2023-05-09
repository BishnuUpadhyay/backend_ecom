const express = require("express")
const router = express.Router();
const {registerUser, loginUser,logOut,forgotPassword,resetPassword, getUserDetail, updatePassword, updateProfile, getAllUser, getSingleUser, changeRole, deleteUser} = require("../controller/usercontroller");
const { isAuthenticatedUser,authorizedRoles } = require("../middleware/auth");

router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/logout").get(logOut)
router.route("/password/forgot").post(forgotPassword)
router.route("/reset/:token").put(resetPassword)
router.route("/me").get(isAuthenticatedUser,getUserDetail)
router.route("/password/update").put(isAuthenticatedUser , updatePassword)
router.route("/me/update").put(isAuthenticatedUser , updateProfile)
router.route("/admin/users").get(isAuthenticatedUser, authorizedRoles("admin"),getAllUser)
router.route("/admin/user/:id")
                .get(isAuthenticatedUser, authorizedRoles("admin"),getSingleUser)
                .put(isAuthenticatedUser, authorizedRoles("admin"),changeRole)
                .delete(isAuthenticatedUser, authorizedRoles("admin"),deleteUser)

module.exports =router;