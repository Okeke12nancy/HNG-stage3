import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { Organisation } from "../entity/organizaton";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "secret_key";
console.log(`Another secret key ${SECRET_KEY}`);

export const register = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, phone } = req.body;

  const userRepository = AppDataSource.getRepository(User);
  const organisationRepository = AppDataSource.getRepository(Organisation);

  try {
    const existingUser = await userRepository.findOneBy({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "Bad request",
        message: "Registration unsuccessful, user already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User();

    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.password = hashedPassword;
    user.phone = phone;

    await userRepository.save(user);

    // Create a new organisation
    const organisation = new Organisation();
    organisation.name = `${firstName}'s Organisation`;
    organisation.users = [user];

    await organisationRepository.save(organisation);

    // Generate a JWT token
    const accessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(201).json({
      status: "success",
      message: "Registration successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Bad request",
      message: "Registration unsuccessful",
      statusCode: 400,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const userRepository = AppDataSource.getRepository(User);

  try {
    // Check if user exists
    const user = await userRepository.findOneBy({ email });
    if (!user) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        status: "Bad request",
        message: "Authentication failed",
        statusCode: 401,
      });
    }

    // Generate a JWT token
    const accessToken = jwt.sign({ userId: user.userId }, SECRET_KEY, {
      expiresIn: "1h",
    });

    res.status(200).json({
      status: "success",
      message: "Login successful",
      data: {
        accessToken,
        user: {
          userId: user.userId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "Bad request",
      message: "Authentication failed",
      statusCode: 401,
    });
  }
};
