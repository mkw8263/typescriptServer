import { sign } from '../middlewares/jwt';
import { Request, Response } from 'express';
import { getRepository } from "typeorm";
import { User } from "../entity/user";
import bcrypt from 'bcrypt-nodejs';


export const login = async (request: Request, response: Response) => {
    const body = request.body;

    const fcmToken = body.fcm_token;
    try {
        await getRepository(User)
            .createQueryBuilder("user")
            .where('user.user_id = :user_id', { user_id: body.user_id })
            .getOne()
            .then((user) => {
                if (!user) {
                    response.status(403).json({ 'message': '아이디와 비밀번호를 다시 확인해주세요.' });
                } else {
                    bcrypt.compare(body.password, user.token, (_, res) => {
                        if (res) {
                            console.log("1111");
                            if (fcmToken) {
                                console.log("2222");
                                console.log("fcmToken =>", fcmToken);
                                getRepository(User)
                                    .createQueryBuilder()
                                    .update()
                                    .set({ fcm_token: fcmToken })
                                    .where('user.user_id = :user_id', { user_id: body.user_id })
                                    .execute()
                                    .then(() => {
                                        console.log("3333");
                                        response.status(200).json({ 'token': sign(body.user_index), 'user_id': user.user_index });
                                    });
                            } else {
                                console.log("4444");
                                response.status(200).json({ 'token': sign(body.user_index), 'user_id': user.user_index });
                            }
                        }
                        else {
                            console.log("5555");
                            response.status(403).json({ 'message': '비밀번호가 일치하지 않습니다.' });
                        }
                    });
                }
            });
    } catch (error) {
        response.status(403).json({ 'message': '잘못된 요청입니다.' });
    }
}