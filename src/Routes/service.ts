import { Router } from "express";
import service from "../Controllers/service";
import verify from "../middlewares/verify_Token"
const router = Router();




router.route('/viewAll').get(service.viewAll);
router.route('/viewMyservices').get([verify], service.viewAllmyService);
router.route("/update").patch(service.UpdateService);
router.route("/delete").delete(service.deleteService);
router.route("/getoneservice").get(service.Oneservice);
router.route('/create').post([verify], service.create);





export default router;