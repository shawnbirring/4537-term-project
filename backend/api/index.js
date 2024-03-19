const express = require('express');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());


const validateRegisterInput = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
];

const validateLoginInput = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
]

const JWT_KEY = process.env.TOKEN

const JWTMiddleware = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, JWT_KEY);
        const user = await prisma.user.findUnique({ where: { id: decoded.id } });
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An error occurred while authenticating user: ${error}` });
    }
}

const createToken = (user) => {
    return jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: '1h' });
}

app.post('/register', validateRegisterInput, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        const token = createToken(newUser);
        res.status(201).json({ message: "User created successfully", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: `An error occurred while registering user: ${error}` });
    }
});

app.post("/login", validateLoginInput, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User Not found" })
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = createToken(user);
        res.status(200).json({ message: "Login Successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An error occurred while logging in: ${error}` });
    }
})

app.get("/admin", JWTMiddleware, async (req, res) => {
    try {
        const isAdmin = await prisma.user.findFirst({
            where: {
                id: req.user.id,
                isAdmin: true
            }
        });
        if (!isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        res.status(200).json({ message: 'Admin page', apiCalls: isAdmin.apiCalls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An error occurred while accessing admin page: ${error}` });
    }
});

app.get('/user', JWTMiddleware, async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id }
        });
        res.status(200).json({ message: 'User landing page', apiCalls: user.apiCalls });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `An error occurred while accessing user page ${error}` });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;