import { Router } from "express";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/Auth.middleware.js";

const videoRouter = Router();

videoRouter.route()
