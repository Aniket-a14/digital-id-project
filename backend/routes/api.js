const express = require("express");
const router = express.Router();
const idController = require("../controllers/idController");

router.post("/register", idController.registerTourist);
// router.post("/update", idController.update); // Not implemented
router.get("/get/:address", idController.getID);

module.exports = router;
