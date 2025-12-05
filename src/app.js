import express from 'express';
import routes from './routes.js';
import fileRouteConfig from './config/fileRoutes.cjs';
import cors from 'cors';

const app = express();

// ✅ Configura CORS para aceitar requisições do frontend no Netlify
app.use(cors({
  origin: "https://devburgerlaurinha.netlify.app",
  credentials: true
}));

// ✅ Permite receber JSON e urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Rotas para uploads de arquivos
app.use('/product-file', fileRouteConfig);
app.use('/category-file', fileRouteConfig);

// ✅ Rotas da API
app.use(routes);

// ✅ Exporta app (para usar com server.js)
export default app;
