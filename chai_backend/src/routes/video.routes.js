import { Router } from "express";
import { publishAVideo } from "../controllers/video.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwtToken from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/publishVideo").post(verifyJwtToken, upload.fields(
    [{
        name: "videoFile",
        maxCount: 1
    },
    {
        name: "thumbnail",
        maxCount: 1
    }]
), publishAVideo)


export default router