import express from 'express';
import cookieParser from 'cookie-parser';
import { Request, Response, NextFunction , Express} from "express";
import auth from "./Routes/auth";
import appointment from "./Routes/appointment";
import category from "./Routes/category";
import favorite from "./Routes/favorite";
import historique from "./Routes/historique";
import notification from "./Routes/notification";
import picture from "./Routes/picture";
import post from "./Routes/post";
import price from "./Routes/price";
import report from "./Routes/report";
import review from "./Routes/review";
import service from "./Routes/service";
import subCategory from "./Routes/subCategory";
import suggestion from "./Routes/suggestion";
import user from "./Routes/user";
import userCondition from "./Routes/usageCondition";
import * as dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import swaggerDoc from './swagger.json';


dotenv.config();


const app: express.Application = express();
const Port = process.env.PORT || 3000;
app.use(cookieParser());
app.use(express.json({ limit: "20kb"}));
app.use(express.urlencoded({ extended: true }));


app.use("/", auth);
app.use("/category", category);
app.use("/appointment", appointment);
app.use("/favorite", favorite);
app.use("/historique", historique);
app.use("/notification", notification);
app.use("/picture", picture);
app.use("/post", post);
app.use("/price", price);
app.use("/report", report);
app.use("/review", review);
app.use("/service", service);
app.use("/subCategory", subCategory);
app.use("/suggestion", suggestion);
app.use("/user", user);
app.use("/userCondition", userCondition);

app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDoc));

app.use("*", (req: Request, res: Response) => {
  res.status(404).json("this page not found");
});


app.listen( Port, () => {
  console.log("server is listning now");
});