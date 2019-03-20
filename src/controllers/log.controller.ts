import { Request, Response } from 'express';
import { getConnection } from 'typeorm';
import { User } from '../entity/user';

export const addLog = async (request: Request, response: Response) => {
    try {
        const userIndex = request.params.id;
        const log = request.body.log;
        
        await getConnection()
            .getRepository(User)
            .createQueryBuilder()
            .update()
            .set({ device_log: log })
            .where("user_index=:id", { id: userIndex })
            .execute();

        response.status(200).send();
    } catch (error) {
        console.log(error);
        response.status(403).json({ 'message': '잘못된 요청입니다.' });
    }
}

export const userLog = async (request: Request, response: Response) => {
    try {
        await getConnection()
            .getRepository(User)
            .find({
                select: ['device_log'],
                where: { user_index: request.query.id }
            }).then((user) => {
                response.status(200).json({ 'device_log': user[0].device_log });
            })
    } catch (error) {
        response.status(403).json({ 'message': '잘못된 요청입니다.' });
    }
}
