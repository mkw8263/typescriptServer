import { verify } from '../middlewares/jwt';
import * as pushController from '../controllers/push.controller';
import express from "express";

const router = express.Router();

router.post("/requestPush/:id", verify, pushController.requestPush);
module.exports = router;