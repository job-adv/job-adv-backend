import { Router } from "express";
import review from "../Controllers/review";
const router = Router();





router.route('/view/:service_id').get(review.ViewAll);
router.route('/add').post(review.addReview);
router.route("/update/:review_id").patch(review.UpdateReview);
router.route("/delete/:review_id").patch(review.deleteReview);




export default router;