import jwt from 'jsonwebtoken';
const isAuthenticated = (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Unauthorized' });
    const decodedToken = jwt.verify(token, 'tjisismysceerrtetkey');
    if (!decodedToken) return res.status(401).json({ message: 'Unauthorized' });
    req.userId = decodedToken.id;
    next();
};

export default isAuthenticated;