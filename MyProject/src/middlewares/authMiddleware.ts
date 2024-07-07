import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
console.log(`This is our secret key ${SECRET_KEY}`);

export const authenticateJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  console.log(token);
  if (!token) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "No token provided",
    });
  }

  // jwt.verify(token, SECRET_KEY, (err, decoded) => {
  //   if (err) {
  //     console.error("JWT Verification Error:", err);
  //     return;
  //   }

  //   console.log("Decoded JWT:", decoded);
  // });

  // res.json({
  //   status: "success",
  // });
  try {
    const decoded: any = jwt.verify(token, SECRET_KEY);
    const userRepository = AppDataSource.getRepository(User);
    const userId = Number(decoded.userId); // Convert decoded.userId to a number
    const user = await userRepository.findOneBy({ userId });

    if (!user) {
      return res.status(401).json({
        status: "Unauthorized",
        message: "Invalid token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      status: "Unauthorized",
      message: "Invalid token",
    });
  }
};
