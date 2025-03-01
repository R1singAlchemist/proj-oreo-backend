const express = require("express");
const { getCarbookings, createCarbooking, updateCarbooking, deleteCarbookings, getCarbooking} = require("../controllers/carbookings");
const router = express.Router();
const {protect, authorize} = require('../middleware/auth')


router.route('/')
.get(protect, authorize('user','admin'),getCarbookings)
.post(protect, authorize('user','admin'), createCarbooking);



router.route('/:id')
.get(protect, authorize('user','admin'),getCarbooking)
.put(protect, authorize('user','admin'), updateCarbooking)
.delete(protect, authorize('user','admin') , deleteCarbookings);

module.exports=router;