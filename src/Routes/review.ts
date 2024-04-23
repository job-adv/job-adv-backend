import { Router } from "express";
import review from "../Controllers/review";
import verify from "../middlewares/verify_Token";
import verifyToken from "../middlewares/verify_Token";
const router = Router();





router.route('/view/:service_id').get(review.ViewAll);
router.route('/add').post([verify],review.addReview);
router.route("/update/:review_id").patch([verify],review.UpdateReview);
router.route("/delete/:review_id").patch([verify],review.deleteReview);




export default router;