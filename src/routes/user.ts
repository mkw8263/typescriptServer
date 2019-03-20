import * as userController from '../controllers/user.controller';
import * as logController from '../controllers/log.controller';
import express from "express";
import { verify } from '../middlewares/jwt';

const router = express.Router();

router.get("/users", verify, userController.users);
router.get("/user", verify, userController.user);
router.get("/user/log", verify, logController.userLog);
router.post("/user/signup", userController.signup);
router.patch("/user/:id/fcmtoken", verify, userController.addUserFCMToken);
router.patch("/user/:id/log", verify, logController.addLog);
router.delete("/user/:id", verify, userController.userDelete);

module.exports = router;