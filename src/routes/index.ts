import express from "express";

import routesUserProfile from "../modules/UserProfile/routesUserProfile";
import interestRoutes from "../modules/Interest/InterestRoutes";
import eventRoutes from "../modules/Event/EventRoutes";

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
router.use("/interest", interestRoutes);
router.use("/event", eventRoutes);

export default router;
