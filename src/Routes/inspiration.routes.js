import express from 'express'
import { createInspiration,getAllInspirations } from '../controllers/inspiration.controller.js'
import { upload } from '../middlewares/multer.middleware.js'

const inspirationRouter = express.Router();

inspirationRouter.route("/create").post(upload.fields([{name:"avatar",maxCount:1}]),createInspiration);
inspirationRouter.route("/all").get(getAllInspirations);
export default inspirationRouter;
