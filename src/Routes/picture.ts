import { Router } from "express";
import picture from "../Controllers/picture";
import verify from "../middlewares/verify_Token"
const router = Router();




router.route('/view').get([verify], picture.View);
router.route('/add').post([verify], picture.addPicture);
router.route("/delete/:picture_id").patch([verify], picture.deletePicture);




export default router;
