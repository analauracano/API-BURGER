import { v4 } from "uuid";
import User from "../models/User.js";
import * as Yup from "yup";
import bcrypt from "bcrypt";

class UserController {
  async store(req, res) {
    const schema = Yup.object({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().min(6).required(),
      // ❌ REMOVIDO: admin não deve vir do frontend
    });

    try {
      schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
      return res.status(400).json({ error: err.errors });
    }

    const { name, email, password } = req.body;

    // ✅ Verificar se email existe
    const existingUser = await User.findOne({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: "Email already taken!" });
    }

    // ✅ Criar hash de senha
    const password_hash = await bcrypt.hash(password, 8);

    // ✅ admin deve ser sempre false para cadastros normais
    const user = await User.create({
      id: v4(),
      name,
      email,
      password_hash,
      admin: false
    });

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      admin: user.admin
    });
  }
}

export default new UserController();