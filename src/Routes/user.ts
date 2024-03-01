import { Router } from "express";
import user from "../Controllers/user";
import admin from "../Controllers/Admin/admin"
const router = Router();




router.route('/viewAllprofessional').get(user.allProfessional);
router.route('/viewAll').post(user.allUser);
router.route("/update").patch(user.updateUser);
router.route("/delete").delete(user.deleteUser);
router.route("/accept").patch(admin.accept_professional);



export default router;