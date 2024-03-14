import { Router } from "express";
import verify from "../middlewares/verify_Token"
import appointment from "../Controllers/appointment"
const router = Router();


router.route('/viewCustomer').get([verify], appointment.ViewCustomAppointment);
router.route('/viewProfessional').get([verify], appointment.ViewProfessionalAppointment);
router.route("/update/:appointment_id").patch([verify], appointment.update)
router.route('/create').post([verify], appointment.create);



export default router;