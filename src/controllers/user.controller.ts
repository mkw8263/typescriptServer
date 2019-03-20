import { sign } from '../middlewares/jwt';
import { Request, Response } from 'express';
import { getRepository, getConnection } from "typeorm";
import { User } from "../entity/user";
import bcrypt from 'bcrypt-nodejs';

export const signup = async (req: Request, res: Response) => {
    const body = req.body;

    const isSignUp = await getRepository(User)
        .createQueryBuilder("user")
        .where('user.user_id = :user_id', { user_id: body.user_id })
        .getOne();

    if (isSignUp) {
        res.status(403).json({ 'message': '이미 가입된 유저입니다.' })
    } else {
        await bcrypt.hash(body.password, null, null, (err, hash) => {
            if (!err) {
                getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(User)
                    .values({
                        user_id: body.user_id,
                        name: body.name,
                        token: hash
                    })
                    .execute()
                    .then(() => {
                        getRepository(User)
                            .find({
                                select: ['user_index'],
                                where: { user_id: body.user_id }
                            }).then((user) => {
                                res.status(201).json({ 'token': sign(user[0].user_index), 'user_id': user[0].user_index });
                            })
                    });
            }
        });
    }
}

export const users = async (req: Request, res: Response) => {
    try {
        const offset = req.query.offset;
        if (offset === undefined) {
            res.status(403).json({ 'message': '잘못된 요청입니다.' });
        } else {
            await getConnection()
                .getRepository(User)
                .find({
                    select: ['user_index', 'user_id', 'name', 'fcm_token'],
                    skip: offset,
                    take: 10
                }).then((users) => {
                    let list: any = [];
                    users.forEach((user, _) => {
                        let isEmptyFcmToken
                        if (user.fcm_token) isEmptyFcmToken = 'Y';
                        else isEmptyFcmToken = 'N';

                        list.push({
                            'id': user.user_index,
                            'user_id': user.user_id,
                            'name': user.name,
                            'fcm_token_yn': isEmptyFcmToken
                        });
                    });
                    res.status(200).json(list);
                });
        }
    } catch (error) {
        res.status(500).json({ 'message': '잘못된 요청입니다.' });
    }
}

export const user = async (req: Request, res: Response) => {
    try {
        const userName = req.query.name;
        await getConnection()
            .getRepository(User)
            .find({
                select: ['user_id', 'name'],
                where: { name: userName }
            }).then((users) => {
                res.status(200).json(users);
            })
    } catch (error) {
        res.status(403).json({ 'message': '잘못된 요청입니다.' });
    }
}

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

export const addUserFCMToken = async (req: Request, res: Response) => {
    try {
        const userIndex = req.params.id;
        const fcmToken = req.body.token;

        await getRepository(User)
            .createQueryBuilder()
            .update()
            .set({ fcm_token: fcmToken })
            .where("user_index = :id", { id: userIndex })
            .execute();

        res.status(200).send();

    } catch (error) {
        res.status(403).json({ 'message': '잘못된 요청입니다.' });
    }
}
