import { Router } from "express";
import { register, login } from "../controllers/auth";
import { userValidationRules } from "../validations/user";
import { errorHandler } from "../middlewares/error-handler";

const authRoutes = Router();

authRoutes.post("/register", userValidationRules, errorHandler, register);
authRoutes.post("/login", login);

export default authRoutes;
