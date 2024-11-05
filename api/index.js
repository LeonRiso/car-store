require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql')

const PORT = process.env.PORT || 3000;

const routes = require('./src/routes/routes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(routes);



app.listen(PORT, () => { console.log("API Turmas respondendo em http://localhost:" + PORT) });