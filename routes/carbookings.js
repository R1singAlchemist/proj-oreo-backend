const express = require("express");
const { getCarbookings, createCarbooking, updateCarbooking, deleteCarbookings, getCarbooking} = require("../controllers/carbookings");
const router = express.Router();
const {protect, authorize} = require('../middleware/auth')


router.route('/').get(getCarbookings).post(protect, authorize('admin'), createCarbooking);
router.route('/:id').get(getCarbooking).put(protect, authorize('admin'), updateCarbooking).delete(protect, authorize('admin') , deleteCarbookings);

module.exports=router;