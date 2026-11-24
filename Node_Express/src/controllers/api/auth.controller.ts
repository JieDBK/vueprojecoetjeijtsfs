import type { Request, Response } from "express";
import { hashPassword, comparePasswords} from "../../utils/password.js";
import { User } from "../../models/User.js";
import { AppDataSource } from "../../data-source.js";
import jwt from "jsonwebtoken"

const userRepository = AppDataSource.getRepository(User)

async function loginUser(req: Request, res: Response) {

    const email = req.body.email;
    const plaintextPassword = req.body.password;

    const user = await userRepository.findOneBy({ email: email })

    if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    const passwordsMatch = await comparePasswords(plaintextPassword, user.password_hash);

    if (!passwordsMatch) {
        return res.status(401).json({ message: "Invalid email or password" });
    }

    // TODO: Generate the JWT and send it back
    const token = jwt.sign(
    { 
        id: user.id, 
        role: user.role 
    }, 
    "my_temporary_secret_123", // Using a hardcoded secret for now
    { expiresIn: '1h' }
);

    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });    
}

async function createNewUser(req: Request, res: Response) {
  const { name, email, password } = req.body;

  if (!name||!email||!password ){
    return res.status(400).json("All fields are required");
  }

  const existingUser = await userRepository.findOneBy({"email": email})
  if (existingUser != null) {
    return res.status(400).json({message: "Email already in use"})
  }
  const hashed_password = await hashPassword(password)
  const newUser = new User(name, email, hashed_password, "user")
  await userRepository.save(newUser)

  const { password_hash, ...savedUser } = newUser

  res.status(201).json(savedUser)
}

export {loginUser, createNewUser}