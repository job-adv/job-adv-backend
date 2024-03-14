import { Router } from "express";
import price from "../Controllers/price";
import  verify from "../middlewares/verify_Token";
const router = Router();


router.route('/add').post([verify],price.addPrice);
router.route("/update/:price_id").patch([verify],price.updatePrice);
router.route('/delete/:price_id').get([verify], price.deletePrice);



export default router;