import { Router } from "express";
const router = Router();
import auth from "../Controllers/authentification"


router.route('/signin').post(auth.signin);
router.route('/login').post(auth.login);
router.route('/logout').get(auth.logout);

export default router;