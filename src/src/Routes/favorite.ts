import { Router } from "express";
import favorite from "../Controllers/favorite";
import verify from "../middlewares/verify_Token"
const router = Router();





router.route('/view').get([verify], favorite.ViewAllFavorite);
router.route('/add').post([verify], favorite.addFavorite);
router.route("/delete/:favorite_id").delete([verify], favorite.deleteFavorite);



export default router;