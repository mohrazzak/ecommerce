// DOTENV VARIABLES
require('dotenv').config();
// NPM
const express = require(`express`);
const helmet = require(`helmet`);
const morgan = require(`morgan`);
const cors = require(`cors`);

// Node Middlewares
const error404 = require(`./utils/errors/error404`);
const nextHandler = require('./utils/errors/nextHandler');

// Node Packages

// Routes import
const userRoutes = require(`./routes/user`);

const app = express();

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cors());

// Routes signing
app.use(userRoutes);

// Error handlers
app.use(nextHandler);

// 404 handlers
app.use(error404);

// Listen on port
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is listening at ${PORT}`));
