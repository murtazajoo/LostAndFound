import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
    try {
        const token = req.cookies?.token || (req.headers.authorization && req.headers.authorization.split(' ')[1]);
        if (!token) return res.status(401).json({ message: 'No token provided', token });

        const secret = process.env.JWT_SECRET || 'change_this_secret';
        const decoded = jwt.verify(token, secret);
        req.userId = decoded?.id;
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

export default auth;
