import { Request, Response, NextFunction } from 'express';

function isProfessional(req: Request, res: Response, next: NextFunction) {
    const user = (req as any).user;
    if (user && user.role === 'professional') {
        next();
    } else {
        return res.status(403).json({ error: 'Unauthorized' });
    }
}