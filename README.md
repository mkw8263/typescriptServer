# TypeScript-Node
사이드 프로젝트 nodeServer(typescript)입니다.


### Languages, WebServer, DB, Lib, FrameWork
- typescript
- typeorm
- nginx
- typeorm
- express
- node
- jwt
- bcrypt
- fcm push


### Main Code

#### 1. routes => user.ts
~~~~typescript
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
~~~~

#### 2. controller => user.controller.ts
~~~~typescript
import { sign } from '../middlewares/jwt';
import { Request, Response } from 'express';
import { getRepository, getConnection } from "typeorm";
import { User } from "../entity/User";
import bcrypt from 'bcrypt-nodejs';

export const userDelete = async (req: Request, res: Response) => {
    try {
        await getConnection()
            .getRepository(User)
            .createQueryBuilder()
            .delete()
            .from(User)
            .where("user_index=:id", { id: req.params.id })
            .execute();
        res.status(200).json(users);
    } catch (error) {
        res.status(403).json({ 'message': '잘못된 요청입니다.' });
    }
}
