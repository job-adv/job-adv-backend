import { Router } from "express";
const router = Router();
import auth from "../Controllers/authentification"
import user from "../Controllers/user"
import verify_token from "../middlewares/verify_Token"
import category from "../Controllers/category"





router.route('/view').get(category.ViewAll);
router.route('/add').post(category.addCategory);
router.route("/update").patch(category.updateCategory)
router.route('/delete').delete(category.deleteCategory);



export default router;