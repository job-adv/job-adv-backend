import { Router } from "express";
import review from "../Controllers/review";
const router = Router();





router.route('/view').get(review.ViewAll);
router.route('/add').post(review.addReview);
router.route("/update").patch(review.UpdateReview);
router.route("/delete").patch(review.deleteReview);




export default router;