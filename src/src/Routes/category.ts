import { Router } from "express";
const router = Router();
import auth from "../Controllers/authentification"
import user from "../Controllers/user"
import verify_token from "../middlewares/verify_Token"
import category from "../Controllers/category"





router.route('/view').get(category.ViewAll);
router.route('/add').post(category.addCategory);
router.route("/update/:category_id").patch(category.updateCategory)
router.route('/delete/:category_id').delete(category.deleteCategory);



export default router;