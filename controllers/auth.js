const User = require("../models/User");

//@desc Register User
//@route POST /api/v1/auth/register
//@access Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    const userRole = role || "user";
    //Create User
    const emailExists = await User.findOne({ email: req.body.email });

    console.log(emailExists);

    if (emailExists) {
      res.status(406).json({
        success: false,
        msg: "Email already registered",
      });
    } else {
      const user = await User.create({
        name,
        email,
        password,
        role: userRole,
        phone,
      });

      sendTokenResponse(user, 200, res);
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
    });
  }
};

//@desc Login User
//@route POST /api/v1/auth/login
//@access Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Validate email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      msg: "Please provide an email and password",
    });
  }

  //Check for user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return res.status(400).json({
      success: false,
      msg: "Invalid credentials",
    });
  }

  //Check if password matches
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      msg: "Invalid credentials",
    });
  }

  sendTokenResponse(user, 200, res);
};

//Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJwtToken();
  const name = user.getName();
  const role = user.getRole();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    name,
    role,
  });
};

//At the end of the file
//@desc Get current logged in user
//@route POST /api/v/1/auth/me
//@access private
exports.getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
};

//@desc      Log user out / clear cookie
//@route     GET /api/v1/auth/logout
//@access    Private
exports.logout = async (req, res, next) => {
  if (!req.cookies.token) {
    return res.status(400).json({
      success: false,
      message: "No user is logged in",
    });
  }
  res.cookie("token", "none", {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
    message: "Logged out successfully",
  });
};
