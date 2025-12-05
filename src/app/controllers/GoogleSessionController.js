import admin from "../../config/firebaseAdmin.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import authConfig from "../../config/auth.js";

class GoogleSessionController {
  async store(req, res) {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({ error: "Token não enviado" });
    }

    try {
      const decoded = await admin.auth().verifyIdToken(idToken);
      const { uid, email, name, picture } = decoded;

      if (!email) {
        return res.status(400).json({ error: "Email não retornado pelo Google" });
      }

      let user = await User.findOne({ where: { email } });

      if (!user) {
        user = await User.create({
          name: name || "Usuário Google",
          email,
          avatar: picture || null,
          google_uid: uid,
          admin: false,
          password_hash: await bcrypt.hash(uid, 8),
        });
      }

      const token = jwt.sign(
        { id: user.id, admin: user.admin, name: user.name },
        authConfig.secret,
        { expiresIn: authConfig.expiresIn }
      );

      return res.status(200).json({
        id: user.id,
        name: user.name,
        email: user.email,
        admin: user.admin,
        avatar: user.avatar,
        token,
      });
    } catch (error) {
      console.error("Erro Google Auth:", error);
      return res.status(401).json({ error: "Token inválido" });
    }
  }
}

export default new GoogleSessionController();
