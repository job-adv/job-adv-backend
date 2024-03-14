import { Router } from "express";
import post from "../Controllers/post";
import verify from "../middlewares/verify_Token"
const router = Router();



router.route('/viewMyPost').get([verify],post.viewAllmyPost);
router.route('/viewAll').get(post.view_All_special_Request);
router.route("/update/:post_id").patch([verify],post.updatePost);
router.route("/delete/:post_id").delete([verify],post.deletePost);
router.route("/add").post([verify], post.addPost);


export default router;