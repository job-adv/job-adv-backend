import { Router } from "express";
import userCondition from "../Controllers/notification";
const router = Router();



router.route('/view').get(userCondition.view);
router.route('/add').post(userCondition.create);
router.route("/update").delete(userCondition.delete);



export default router;