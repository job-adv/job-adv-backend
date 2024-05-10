import { Router } from "express";
import notification from "../Controllers/notification";
import verify from "../middlewares/verify_Token";
import isAdmin from "../middlewares/verify_admin";
const router = Router();



router.route('/view').get([verify], notification.view);
router.route('/add').post([verify], notification.create);
router.route('/notifyAll').post([verify, isAdmin], notification.notifyAllUsers);
router.route("/delete/:notification_id").delete([verify], notification.delete);


export default router;
