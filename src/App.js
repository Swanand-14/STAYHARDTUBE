import express from 'express'
import cors from "cors"
import cookieParser from "cookie-parser"
import subscriptionRouter from './Routes/subscription.routes.js'

const app = express()
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
//Routes
import userRouter from './Routes/user.routes.js'
import videoRouter from './Routes/videos.routes.js'
import commentRouter from './Routes/comment.routes.js'
import inspirationRouter from './Routes/inspiration.routes.js'
import followRouter from './Routes/follow.routes.js'
import postsRouter from './Routes/posts.routes.js'
//Routes declaration
app.use("/api/v1/users",userRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/comments",commentRouter)
app.use("/api/v1/inspiration",inspirationRouter)
app.use("/api/v1/follow-inspiration",followRouter)
app.use("/api/v1/posts",postsRouter)



export {app}