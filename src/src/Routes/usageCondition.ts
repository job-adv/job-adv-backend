import { Router } from "express";
import UsageCondition from "../Controllers/usageConditions";
const router = Router();



router.route('/add').post(UsageCondition.addUsageConditions);
router.route('/delete/:documentID').delete(UsageCondition.deleteUsageConditions);
router.route("/view").get(UsageCondition.viewAll);




export default router;