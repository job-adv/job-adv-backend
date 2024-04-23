import { Router } from "express";
import message from "../Controllers/message";
import verify from "../middlewares/verify_Token";
const router = Router();





router.route('/').get([verify], message.getMessages);
router.route('/').post([verify], message.sendMessage);


export default router;