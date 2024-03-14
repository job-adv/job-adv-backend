import { Router } from "express";
import report from "../Controllers/report";
import verify from "../middlewares/verify_Token";
const router = Router();



router.route('/view').get(report.ViewReports);
router.route('/delete/:reportID').delete(report.deleteReport);
router.route("/create").post([verify], report.createReport);





export default router;