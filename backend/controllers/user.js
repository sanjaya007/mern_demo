const UserModal = require("../model/user");
const VerificationTokenModel = require("../model/verificationToken");
const jwt = require("jsonwebtoken");
const { isValidObjectId } = require("mongoose");
const errorResponder = require("../utils/messageResponder");
const { generateOTP, mailTransport, emailTemplate } = require("../utils/mail");

const createUser = async (req, res) => {
  try {
    const body = req.body;

    const checkEmail = await UserModal.findOne({ email: body.email });

    if (checkEmail) {
      errorResponder(res, "This email is already exist !");
      return false;
    }

    const newUser = new UserModal(body);

    const OTP = generateOTP();
    const verificationToken = new VerificationTokenModel({
      owner: newUser._id,
      token: OTP,
    });

    await verificationToken.save();
    await newUser.save();

    mailTransport().sendMail({
      from: "emailverification@email.com",
      to: newUser.email,
      subject: "Verify your email account !",
      html: emailTemplate(OTP),
    });

    res.send("Registered Successfull !");
  } catch (error) {
    console.log(error);
  }
};

const login = async (req, res) => {
  const body = req.body;
  if (!body.email.trim() || !body.password.trim()) {
    errorResponder(res, "Email or Password is missing !");
    return false;
  }

  const user = await UserModal.findOne({ email: body.email });
  if (!user) {
    errorResponder(res, "User not found !");
    return false;
  }

  const isMatched = await user.comparePassword(body.password);
  if (!isMatched) {
    errorResponder(res, "Email/Password is incorrect !");
    return false;
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.json({
    success: true,
    user: { name: user.name, email: user.email, id: user._id, token: token },
  });
};

const verifyEmail = async (req, res) => {
  const body = req.body;
  console.log(body);

  if (!body.userId || !body.otp.trim()) {
    errorResponder(res, "Invalid request, missing parameters !");
    return false;
  }

  if (!isValidObjectId(body.userId)) {
    errorResponder(res, "Invalid user id !");
    return false;
  }

  const user = await UserModal.findById(body.userId);
  if (!user) {
    errorResponder(res, "Sorry, user not found !");
    return false;
  }

  if (user.verified) {
    errorResponder(res, "This account is already verified !");
    return false;
  }

  const token = await VerificationTokenModel.findOne({ owner: user._id });
  if (!token) {
    errorResponder(res, "Sorry, user not found !");
    return false;
  }

  const isMatched = await token.compareToken(body.otp);
  if (!isMatched) {
    errorResponder(res, "Please provide a valid token !");
    return false;
  }

  user.verified = true;

  await VerificationTokenModel.findByIdAndDelete(token._id);
  await user.save();
  res.send("Email verified Properly !");

  mailTransport().sendMail({
    from: "emailverification@email.com",
    to: user.email,
    subject: "congratulation !",
    html: emailTemplate("You have registered successfully !"),
  });
};

module.exports = { createUser, login, verifyEmail };
