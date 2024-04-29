import { Router } from "express";
import search from "../Controllers/search";
const router = Router();


router.route('/').post(search.search);


export default router;