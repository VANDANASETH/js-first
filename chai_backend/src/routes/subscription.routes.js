import { Router } from "express";
import { toggleSubscription } from "../controllers/subscription.controller.js";
import verifyJwtToken from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJwtToken)

router.route("/c/:channelId").post(toggleSubscription)

export default router