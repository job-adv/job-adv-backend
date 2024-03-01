import { Router } from "express";
import price from "../Controllers/price";
import  verify from "../middlewares/verify_Token";
const router = Router();


router.route('/add').post([verify],price.addPrice);
router.route("/update").patch([verify],price.updatePrice);
router.route('/delete').get([verify], price.deletePrice);



export default router;