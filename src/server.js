import 'dotenv/config'; // ⚠️ Isso deve vir antes de qualquer outro import
import express from 'express';
import path from 'path';
import app from './app.js';
import './database/index.js';

const __dirname = path.resolve();
const port = process.env.PORT

// Servir arquivos de produtos
app.use('/product-file', express.static(path.resolve(__dirname, 'uploads')));

app.listen(port, () => console.log('Server is running at port 3001'));
