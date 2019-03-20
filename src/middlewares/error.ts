import { Request, Response, NextFunction } from 'express';

module.exports = () => (req: Request, res: Response, next: NextFunction) => {
    console.log("request");
    res.send("요청 페이지를 찾지 못하였습니다.");
}
