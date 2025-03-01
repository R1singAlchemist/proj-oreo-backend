const Carbooking = require("../models/Carbooking");
const Provider = require("../models/Provider");

//@desc Get all carbookings
//@route GET /api/v1/carbookings
//@access Public
exports.getCarbookings = async (req, res, next) => {
  try {
    const carbookings = await Carbooking.find();

    res.status(200).json({
      success: true,
      count: carbookings.length,
      data: carbookings,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc Get single carbooking
//@route Get /api/v1/carbookings/:id
//@access Public
exports.getCarbooking = async (req, res, next) => {
  try {
    const carbooking = await Carbooking.findById(req.params.id);

    if (!carbooking) {
      return res.status(400).json({
        success: false,
        msg: "No Carbooking with specified ID",
      });
    }

    res.status(200).json({
      success: true,
      data: carbooking,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: "Error occured",
    });
  }
};

//@desc Creat new Carbooking
//@route POST /api/v1/carbookings
//@access Private
exports.createCarbooking = async (req, res, next) => {
  try {
    const provider = await Provider.findOne({
      name: req.body.provider,
    });

    if (!provider) {
      console.log("Provider not found");
      res.status(400).json({
        success: false,
        msg: "No Provider with specified name",
      });
    } else {

      req.body.provider = provider.id;

      req.body.user = req.user.id;

      //check existing bookings
      const existedBooking = await Carbooking.find({ user: req.user.id });

      //If the user is not an admin, they can only create 3 bookings.
      if (existedBooking.length >= 3 && req.user.role !== "admin") {
        return res.status(400).json({
          success: false,
          message: `The user with ID ${req.user.id} has already made 3 bookings`,
        });
      }

      //Parse date
      const bookingDate = new Date(req.body.bookingDate);

      const carbooking = await Carbooking.create(req.body);

      carbooking.bookingDate = bookingDate;

      const returnQuery = await Carbooking.findById(carbooking.id).populate("user").populate("provider");

      res.status(201).json({
        success: true,
        msg: bookingDate,
        data: returnQuery
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: "Error has occured",
    });
  }
};

//@desc Update carbooking
//@route PUT /api/v1/carbookings/:id
//@access Private
exports.updateCarbooking = async (req, res, next) => {
  //res.status(200).json({success:true, msg:'Update hospital '+req.params.id});
  try {
    const carbooking = await Carbooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!carbooking) {
      return res.status(400).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: carbooking,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};

//@desc delete carbooking
//@route DELETE /api/v1/carbookings/:id
//@access Private
exports.deleteCarbookings = async (req, res, next) => {
  //res.status(200).json({success:true, msg : 'Delete hospital '+req.params.id});
  try {
    const carbooking = await Carbooking.findByIdAndDelete(req.params.id);

    if (!carbooking) {
      return res.status(400).json({
        success: false,
      });
    }

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({
      success: false,
    });
  }
};
