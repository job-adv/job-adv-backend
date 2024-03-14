import { Router } from "express";
import subCategory from "../Controllers/subCategory";
const router = Router();






router.route('/view').get(subCategory.viewAll);
router.route('/add').post(subCategory.addsubCategory);
router.route("/update/:subCategory_id").patch(subCategory.UpdateSubCategory);
router.route('/delete/:subCategory_id').get(subCategory.deleteSubCategory);





export default router;