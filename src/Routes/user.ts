import { Router } from "express";
import user from "../Controllers/user";
import admin from "../Controllers/Admin/admin";
import verify from "../middlewares/verify_Token"
import isAdmin from "../middlewares/verify_admin";
const router = Router();




router.route('/viewAllprofessional').get(user.allProfessional);
router.route('/viewAll').get(user.allUser);
router.route("/update").patch([verify],user.updateUser);
router.route("/delete/:user_id").delete(user.deleteUser);
router.route("/accept/:user_id").patch([verify, isAdmin], admin.accept_professional);
router.route("/updateUserCategory").patch([verify], user.updateUserCategory);


export default router;