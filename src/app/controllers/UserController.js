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
        admin: Yup.boolean().required(),
    });

    try {    
    schema.validateSync(req.body, { abortEarly: false, strict: true });
    } catch (err) {
        return res.status(400).json({ error: err.errors });
    }

     const { name, email, password,admin } = req.body;

    const existingUser = await User.findOne({ where: { 
        email,
    },
    });

    if (existingUser) {
        return res.status(400).json({ error: "Email alredy taken!" });
    }

    const password_hash = await bcrypt.hash(password, 8);

    const user = await User.create({
        id: v4(),
        name,
        email,
        password_hash,
        admin,
    });

    return res.status(201).json({
        name: user.name,
        email: user.email,
        admin: user.admin,
        id: user.id,
    });
    }
}

export default new UserController();