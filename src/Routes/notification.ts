import { Router } from "express";
import notification from "../Controllers/notification";
import verify from "../middlewares/verify_Token"
const router = Router();



router.route('/view').get([verify], notification.view);
router.route('/add').post([verify], notification.create);
router.route("/delete/:notification_id").patch([verify], notification.delete);


export default router;
