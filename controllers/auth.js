import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';


const registerController = async (req, res) => {

    const name = req.body.name
    const email = req.body.email
    const password = req.body.password

    const hashedPassword = bcrypt.hashSync(password, 10)

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
    }


    console.log(name, email, password)
    const user = await User.create({ name, email, password: hashedPassword })

    if (user) {
        user.password = undefined;
        res.status(201).json({ message: 'User registered successfully', user })
    } else {
        res.status(500).send('Error registering user')
    }

}


const loginController = async (req, res) => {
    const email = req.body.email
    const password = req.body.password

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid email or password' });
    const token = jwt.sign({ id: user._id }, 'tjisismysceerrtetkey');

    res.cookie('token', token, { sameSite: "lax", httpOnly: true, path: "/", maxAge: 60000 * 60, }).json({ message: 'Login successful', user })
}

export { loginController, registerController };

