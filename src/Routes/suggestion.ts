import { Router } from "express";
import suggestion from "../Controllers/suggestion";
import verify from "../middlewares/verify_Token"
const router = Router();




router.route('/view').get([verify] ,suggestion.ViewSuggestions);
router.route('/add').post([verify], suggestion.createSuggestion);
router.route("/delete/:suggestionID").patch([verify], suggestion.deleteSuggestion);




export default router;