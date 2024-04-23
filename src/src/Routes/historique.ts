import { Router } from "express";
import historique from "../Controllers/historique";
import verify from "../middlewares/verify_Token";
const router = Router();





router.route('/view').get([verify], historique.View);

export default router;
