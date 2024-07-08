import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";

const SECRET_KEY = process.env.SECRET_KEY || "secret-key";

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .json({ status: "Unauthorized", message: "No token provided" });
  }

  try {
    const decoded: any = verify(token, SECRET_KEY);
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ userId: decoded.userId });

    if (!user) {
      return res
        .status(401)
        .json({ status: "Unauthorized", message: "Invalid token" });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ status: "Unauthorized", message: "Invalid token" });
  }
};
