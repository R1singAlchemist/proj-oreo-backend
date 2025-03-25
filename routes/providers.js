const express = require("express");
const {
  getProviders,
  createProvider,
  updateProvider,
  getProvider,
} = require("../controllers/providers");
const { post } = require("./carbookings");
const { authorize, protect } = require("../middleware/auth");
const router = express.Router();

router
  .route("/")
  .get(getProviders)
  .post(protect, authorize("admin"), createProvider);

router
  .route("/:id")
  .get(getProvider)
  .put(protect, authorize("admin"), updateProvider);

module.exports = router;
