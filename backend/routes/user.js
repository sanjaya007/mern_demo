const express = require("express");
const router = express.Router();
const { createUser, login, verifyEmail } = require("../controllers/user");
const {
  validateUser,
  validationResponse,
} = require("../middlewares/validator");

router.post("/api/user/create", validateUser, validationResponse, createUser);
router.post("/api/user/login", login);
router.post("/api/user/verify_email", verifyEmail);

module.exports = router;
