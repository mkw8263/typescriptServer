
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

require('dotenv').config();
const secret_key = process.env.JWT_KEY;
export function sign(id: number) {
    const options = {
        algorithm: "HS512",
        expiresIn: 60 * 60 * 24 * 30 // 30 days
    };
    const payload = {
        "user_id": id
    };

    let token = jwt.sign(payload, secret_key, options);
    return token;
}
export const verify = function verify(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization
    jwt.verify(token, secret_key, { algorithms: ['HS512'] }, (err, _) => {
        if (err) return res.status(419).json({ "status": "failed", "message": "Invalid Token" })
        else next()
    });
}