const Carbooking = require("../models/Carbooking");
const Provider = require("../models/Provider");

//@desc Get all carbookings
//@route GET /api/v1/carbookings
//@access Public
exports.getCarbookings = async (req, res, next) => {
  try {
    
    let carbookings;

    if (req.user.role === "admin") {
      carbookings = await Carbooking.find().populate("user").populate("provider");;
    } else {
    
      carbookings = await Carbooking.find({ user: req.user.id }).populate("user").populate("provider");;
    }

    if (carbookings.length === 0) {
      return res.status(404).json({
        success: false,
        msg: "No car bookings found for this user",
      });
    }

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
    const carbooking = await Carbooking.findById(req.params.id).populate("user").populate("provider");

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
    const provider = await Provider.findById(req.body.providerId)

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
        return res.status(406).json({
          success: false,
          message: `The user with ID ${req.user.id} has already made 3 bookings`,
        });
      }

      //Parse date
      const pickupDate = new Date(req.body.pickupDate);
      const returnDate = new Date(req.body.returnDate);

      if( pickupDate.getTime() >= returnDate.getTime()){
        return res.status(405).json({
          success: false,
          message: `The pickup date is the same or after the return date`
        })
      }

      const carbooking = await Carbooking.create(req.body);

      const carbookingID = carbooking.id;

      const returnQuery = await Carbooking.findById(carbooking.id).populate("user").populate("provider");

      res.status(201).json({
        success: true,
        msg: carbookingID,
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
  try {
    //find ID
    const carbooking = await Carbooking.findById(req.params.id);
    //if error
    if (!carbooking) {
      return res.status(400).json({
        success: false,
        msg: "No Carbooking found with specified ID",
      });
    }

    //if user = admin or owner
    if (req.user.role === "admin" || carbooking.user.toString() === req.user.id) {
      // update
      const pickupDate = new Date(req.body.pickupDate);
      const returnDate = new Date(req.body.returnDate);

      if( pickupDate.getTime() >= returnDate.getTime()){
        return res.status(400).json({
          success: false,
          message: `The pickup date is the same or after the return date`
        })
      }

      const update = {
        pickupDate : req.body.pickupDate,
        returnDate : req.body.returnDate
      }

      const updatedCarbooking = await Carbooking.findByIdAndUpdate(
        req.params.id,
        update,
        {
          new: true, 
          runValidators: true, 
        }
      );

      res.status(200).json({
        success: true,
        data: updatedCarbooking,
      });
    } else {
      return res.status(401).json({
        success: false,
        msg: "You can only update your own car bookings or if you're an admin",
      });
    }
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: "Error occurred",
    });
  }
};

//@desc Delete carbooking
//@route DELETE /api/v1/carbookings/:id
//@access Private
exports.deleteCarbookings = async (req, res, next) => {
  try {
    // ค้นหา carbooking ตาม ID
    const carbooking = await Carbooking.findById(req.params.id);

    if (!carbooking) {
      return res.status(400).json({
        success: false,
        msg: "No Carbooking found to delete",
      });
    }

    
    if (req.user.role !== 'admin' && req.user.id !== carbooking.user.toString()) {
      return res.status(403).json({
        success: false,
        msg: "You are not authorized to delete this carbooking",
      });
    }

    //deletedata
    await Carbooking.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      msg: "Error occurred",
    });
  }
};

