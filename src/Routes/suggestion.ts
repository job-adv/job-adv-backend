import { Router } from "express";
import suggestion from "../Controllers/suggestion";
const router = Router();




router.route('/view').get(suggestion.ViewSuggestions);
router.route('/add').post(suggestion.createSuggestion);
router.route("/delete").patch(suggestion.deleteSuggestion);




export default router;