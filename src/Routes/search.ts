import { Router } from "express";
import search from "../Controllers/search";
const router = Router();


router.route('/').get(search.search);


export default router;