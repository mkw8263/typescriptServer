import * as loginController from '../controllers/login.controller';
import express from "express";

const router = express.Router();

router.post("/login", loginController.login);
module.exports = router;