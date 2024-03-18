const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
// app.use(session({
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//     cookie: {
//         secure: false,
//         httpOnly: true,
//         maxAge: 3600000
//     }
// }));


const validateRegisterInput = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
];

const validateLoginInput = [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
]

app.get("/api/auth", (_, res) => {
    res.status(200).json({ message: "API is up and running on /api/auth" });
});

app.post('/api/auth/register', validateRegisterInput, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({ message: `User created successfully: ${email}` });
    } catch (error) {
        res.status(500).json({ message: `An error occurred while registering user: ${email}` });
    }
});

app.post("/api/auth/login", validateLoginInput, async (req, res) => {
    const errors = validateLoginInput(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(404).json({ error: "User Not found" })
        }

        const passwordMatch = bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        // req.session.userID = user.id;
        res.status(200).json({ message: "Login Successful" });
    } catch (error) {
        res.status(500).json({ error: "An error occurred while loggin in" });
    }
})

// app.get("/api/auth/admin", async (req, res) => {
//     try {
//         const isAdmin = await prisma.user.findFirst({
//             where: {
//                 id: req.session.userID,
//                 isAdmin: true
//             }
//         });
//         if (!isAdmin) {
//             return res.status(403).json({ error: 'Forbidden' });
//         }
//         res.status(200).json({ message: 'Admin page', apiCalls: isAdmin.apiCalls });
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while accessing admin page' });
//     }
// })

// app.get('/api/auth/user', async (req, res) => {
//     try {
//         const user = await prisma.user.findUnique({
//             where: { id: req.session.userId }
//         });
//         res.status(200).json({ message: 'User landing page', apiCalls: user.apiCalls });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while accessing user page' });
//     }
// });

// app.get('/api/auth/logout', async (req, res) => {
//     try {
//         req.session.destroy((err) => {
//             if (err) {
//                 return res.status(500).json({ error: 'An error occurred while logging out' });
//             }
//             res.clearCookie('connect.sid');
//             res.status(200).json({ message: 'Logout successful' });
//         });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'An error occurred while logging out' });
//     }
// });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

module.exports = app;