const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const { TextGenerationPipeline } = require("../model/TextGenerationPipeline");
require("dotenv").config();
const swagger = require('swagger-jsdoc')
const swaggerUI = require('swagger-ui-express')
const yaml = require('yaml')
const fs = require('fs')
const path = require('path')
// const HUGGING_FACE_MODEL_TOKEN = process.env.HUGGING_FACE_MODEL_TOKEN;

const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const prisma = new PrismaClient();
const app = express();

const corsOptions = {
  origin: process.env.DOMAIN,
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
app.options("*", cors(corsOptions));

const validateRegisterInput = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 3 }),
];

const validateLoginInput = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
];

const JWT_KEY = process.env.TOKEN;

const sendTokenResponse = (user, statusCode, res) => {
  const token = jwt.sign({ id: user.id }, JWT_KEY, { expiresIn: "1h" });

  const cookieOptions = {
    expires: new Date(Date.now() + 3600000), // 1 hour
    httpOnly: true,
    sameSite: "None",
    secure: true,
    // domain: process.env.DOMAIN,
  };

  res.cookie("token", token, cookieOptions);

  res.status(statusCode).json({ message: "Success" });
};

const JWTMiddleware = async (req, res, next) => {
  console.log(req.cookies.token);

  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_KEY);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `An error occurred while authenticating user: ${error}` });
  }
};

async function incrementApiUsage(requestType) {
  const fieldToUpdate = `${requestType.toLowerCase()}Total`;

  await prisma.apiUsage.update({
    where: { id: 1 },
    data: {
      [fieldToUpdate]: {
        increment: 1
      }
    }
  });
}

app.post("/register", validateRegisterInput, async (req, res) => {
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
        password: hashedPassword,
      },
    });
    sendTokenResponse(newUser, 201, res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `An error occurred while registering user: ${error}` });
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
      return res.status(404).json({ error: "User Not found" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    sendTokenResponse(user, 200, res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `An error occurred while logging in: ${error}` });
  }
});

app.post("/ai", JWTMiddleware, async (req, res) => {
  // const { codeBlock, programmingLanguage } = req.body;
  const { text } = req.body;
  try {
    const model = await TextGenerationPipeline.getInstance();
    const messages = [
      {
        role: "system",
        content:
          "You should act like a jury and say what a jury would say in the following situations",
      },
      { role: "user", content: text },
    ];
    const prompt = model.tokenizer.apply_chat_template(messages, {
      tokenize: false,
      // add_generation_prompt: true,
    });
    response = await model(prompt, {
      max_new_tokens: 128,
      do_sample: false,
      return_full_text: false,
    });
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { apiCalls: { decrement: 1 } },
    });
    res.status(200).json({
      message: "API response",
      modelData: response,
      apiCalls: updatedUser.apiCalls,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `An error occurred while accessing API: ${error}` });
  }
});

app.get("/users", JWTMiddleware, async (req, res) => {
  try {
    const isAdmin = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        isAdmin: true,
      },
    });
    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: `An error occurred while accessing users: ${error}` });
  }
});

app.get("/auth/status", JWTMiddleware, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      return res.status(401).json({ isAuthenticated: false });
    }

    // Determine if the user is an admin and append appropriate data
    let responseData = {
      isAuthenticated: true,
      role: user.isAdmin ? "admin" : "user",
      email: user.email,
      apiCalls: user.apiCalls,
    };

    if (user.isAdmin) {
      const allUsers = await prisma.user.findMany();
      responseData.adminData = allUsers;
    }

    res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: `An error occurred: ${error}` });
  }
});

app.get("/userData/:userID", JWTMiddleware, async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        isAdmin: true,
      },
    });
    if (!admin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await prisma.user.findFirst({
      where: { id: Number(req.params.userID) },
    });
    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `An error occurred: ${err}` });
  }
});

app.patch("/userData", JWTMiddleware, async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        isAdmin: true,
      },
    });
    if (!admin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await prisma.user.update({
      where: { id: req.body.userData.id },
      data: {
        email: req.body.userData.email,
        password: req.body.userData.password,
        isAdmin: req.body.userData.isAdmin,
        apiCalls: req.body.userData.apiCalls,
      },
    });
    console.log("updated", user);
    res.status(200).json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `An error occurred: ${err}` });
  }
});

app.delete("/userData/:userID", JWTMiddleware, async (req, res) => {
  try {
    const admin = await prisma.user.findFirst({
      where: {
        id: req.user.id,
        isAdmin: true,
      },
    });
    if (!admin) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const user = await prisma.user.delete({
      where: { id: Number(req.params.userID) },
    });
    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `An error occurred: ${err}` });
  }
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out" });
});


const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Law AI",
      version: "1.0",
      description:
        "API that supports the Law AI application.",
    },
    servers: [
      {
        url: process.env.DOMAIN,
      },
    ],
  }
};

app.get('/files', (req, res) => {
  // Read the contents of the directory
  fs.readdir('./backend/utils', (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Send the list of file names as a JSON response
    res.json({ files: files});
  });
});

app.get('/backendfiles', (req, res) => {
  // Read the contents of the directory
  fs.readdir('./backend', (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return res.status(500).send('Internal Server Error');
    }

    // Send the list of file names as a JSON response
    res.json({ files: files});
  });
});

try {
  const yamlfile = fs.readFileSync('./backend/utils/apidocs.yaml', 'utf-8')
  const swaggerDoc = yaml.parse(yamlfile)

  app.use(
    "/api-docs",
    swaggerUI.serve,
    swaggerUI.setup(swaggerDoc, {customCssUrl: CSS_URL})) 
  } catch (e) {
    console.log(e)
  }

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
