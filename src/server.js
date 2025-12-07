import 'dotenv/config';
import express from 'express';
import path from 'path';
import app from './app.js';
import './database/index.js'; // sua conexão com MongoDB

const __dirname = path.resolve();
const port = process.env.PORT || 3001;

// Servir uploads localmente
app.use('/product-file', express.static(path.resolve(__dirname, 'uploads')));

app.listen(port, () => console.log(`Server is running at port ${port}`));
