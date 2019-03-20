import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { User } from "../entity/user";
import admin from 'firebase-admin';

require('dotenv').config();
admin.initializeApp({
    credential: admin.credential.cert(require('../../service_account.json')),
    databaseURL: process.env.FCM_DB_URL
});

export const requestPush = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;

        await getRepository(User)
            .find({
                where: { user_index: id }
            }).then((user) => {
                const message = {
                    data: {
                        score: '000',
                        time: '000'
                    },
                    token: user[0].fcm_token
                }
                admin.messaging().send(message);
                console.log("push success");
                res.status(200).send();
            })
    } catch (error) {
        console.log(error);
        res.status(403).json({ 'message': "잘못된 요청입니다." })
    }
}