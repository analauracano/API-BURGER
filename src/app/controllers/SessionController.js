import * as Yup from "yup";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authConfig from "./../../config/auth.js";

class SessionController {
    async store(req, res) {
        const schema = Yup.object({
            email: Yup.string().email().required(),
            password: Yup.string().min(6).required(),
        });

       const isValid = await schema.isValid(req.body, { 
        abortEarly: false,
        strict: true});

        const emailOrPasswordIncorrect = () => {
            return res.status(400).json({ error: "Email or password incorrect"
        })
    };

    if (!isValid) {
        return emailOrPasswordIncorrect();
         }
   
    const { email, password } = req.body;

    const existingUser = await User.findOne({ where: { 
        email,
    },
    });

    if (!existingUser) {
        return emailOrPasswordIncorrect();
    }

    const isPasswordValid = await bcrypt.compare(password, existingUser.password_hash);

    if (!isPasswordValid) {
        return emailOrPasswordIncorrect();
    }

    const token = jwt.sign({ id: existingUser.id, admin: existingUser.admin }, authConfig.secret,
        {
        expiresIn: authConfig.expiresIn,
    });

        return res.status(200).json({ 
            id: existingUser.id,
            name: existingUser.name,
            email: existingUser.email,
            admin: existingUser.admin,
            token,
         });
    }
}

export default new SessionController();