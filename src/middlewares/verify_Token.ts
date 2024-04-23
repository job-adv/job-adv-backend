import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import http_status_code from "../constant/http_status_code";
import UserType from "../constant/types";

export default async function verifyToken(req: Request, res: Response, next: NextFunction) {
    let status: number = http_status_code.serverError;

    try {
        const authHeader: string | undefined = req.headers.authorization || req.headers.Authorization as string;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            status = http_status_code.Forbidden;
            throw new Error("Token not valid");
        }
        const token: string = authHeader.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_KEY as string, async (err: jwt.VerifyErrors | null, decoded: any) => {
            if (err) {
                if (!req.cookies || !req.cookies.jwt) {
                    return res.status(401).json({ success: false, msg: "Unauthorized" });
                }

                const refreshToken = await req.cookies.jwt;

                jwt.verify(refreshToken, process.env.REFRECH_TOKEN_KEY as string, async (err: any, decoded: any) => {
                    if (err) {
                        return res.status(401).json({ success: false, msg: "Unauthorized" });
                    }
 
                    const user = {
                        user_id: decoded.user_id,
                        firstname: decoded.firstname,
                        lastname: decoded.lastname,
                        username: decoded.username,
                        email: decoded.email,
                        role: decoded.role,
                        adress: decoded.adress
                    } as Omit<UserType, "password">;

                    let access_token_secret: string = process.env.ACCESS_TOKEN_KEY as string;
                    const newToken = jwt.sign(user, access_token_secret, { expiresIn: "1h" });
                    res.setHeader('token', newToken);
                    (req as any).user = user; // Type assertion
                    next();
                });
            } else {
                const user = {
                    user_id: decoded.user_id,
                    firstname: decoded.first_name,
                    lastname: decoded.last_name,
                    username: decoded.username,
                    email: decoded.email,
                    role: decoded.role,
                    adress: decoded.adress
                } as Omit<UserType, "password">;

                (req as any).user = user;
                next();
            }
        });
    } catch (err) {
        res.status(status).json({
            status: "failed",
            msg: err instanceof Error ? err.message : err
        });
    }
}
