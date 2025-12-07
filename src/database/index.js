import { Sequelize } from "sequelize";
import mongoose from "mongoose";
import databaseConfig from "../config/database.cjs";

import User from "../app/models/User.js";
import Product from "../app/models/Product.js";
import Category from "../app/models/Category.js";

const models = [User, Product, Category];
class Database {
  constructor() {
    this.initPostgres();
    this.initMongo();
  }

  initPostgres() {
    try {
      this.connection = new Sequelize(databaseConfig);

      models
        .map((model) => model.init(this.connection))
        .map((model) => model.associate && model.associate(this.connection.models));

      console.log("📌 PostgreSQL conectado com sucesso!");
    } catch (err) {
      console.error("❌ Erro ao conectar ao PostgreSQL:", err);
    }
  }

  async initMongo() {
    const mongoURI = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/burger";

    try {
      await mongoose.connect(mongoURI, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log("📌 MongoDB conectado com sucesso!");
    } catch (error) {
      console.error("❌ Erro ao conectar ao MongoDB:", error);
    }
  }
}

// Chamando a conexão do Mongo de forma garantida
const database = new Database();
database.initMongo(); // garante que a async funcione

export default database;
