import { Router } from "express";
import subCategory from "../Controllers/subCategory";
import verify from "../middlewares/verify_Token"
const router = Router();






router.route('/view').get(subCategory.viewAll);
router.route('/add').post([verify], subCategory.addsubCategory);
router.route("/update/:subCategory_id").patch([verify],subCategory.UpdateSubCategory);
router.route('/delete/:subCategory_id').delete([verify],subCategory.deleteSubCategory);





export default router;