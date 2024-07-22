import express from "express";

import routesUserProfile from "../controllers/UserProfile/routesUserProfile";
import routesInterest from "../controllers/Interest/InterestRoutes";

const router = express.Router();

router.route("/").get(async (_req, res) => {
  try {
    res.status(200).send({ message: "on line!" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal server error" });
  }
});

// Mount user routes onto the main router
router.use("/userprofile", routesUserProfile);
router.use("/interest", routesInterest);

export default router;
