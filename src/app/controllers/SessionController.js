import * as Yup from "yup";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "./../../config/auth.js";

class SessionController {
  async store(req, res) {
    try {
      console.log("REQ.BODY:", req.body); // DEBUG

      if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({ error: "Body is missing" });
      }

      const schema = Yup.object({
        email: Yup.string().email().required(),
        password: Yup.string().min(6).required(),
      });

      const isValid = await schema.isValid(req.body, {
        abortEarly: false,
        strict: true,
      });

      if (!isValid) {
        return res.status(400).json({ error: "Email ou senha inválidos" });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ where: { email } });

      if (!existingUser || !existingUser.password_hash) {
        return res.status(400).json({ error: "Email ou senha incorretos" });
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        existingUser.password_hash
      );

      if (!isPasswordValid) {
        return res.status(400).json({ error: "Email ou senha incorretos" });
      }

      const token = jwt.sign(
        { id: existingUser.id, admin: existingUser.admin, name: existingUser.name },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      return res.status(200).json({
        id: existingUser.id,
        name: existingUser.name,
        email: existingUser.email,
        admin: existingUser.admin,
        token,
      });
    } catch (err) {
      console.error("Erro no login:", err);
      return res.status(500).json({ error: "Erro interno no servidor" });
    }
  }
}

export default new SessionController();
