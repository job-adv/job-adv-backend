import { Router } from "express";
import conversation from "../Controllers/message";
import verify from "../middlewares/verify_Token";
const router = Router();





router.route('/').get([verify], conversation.getConversations);

export default router;