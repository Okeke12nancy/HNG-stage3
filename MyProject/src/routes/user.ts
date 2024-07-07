import { Router } from "express";
import { createUser } from "../controllers/user";
import { userValidationRules } from "../validations/user";
import { errorHandler } from "../middlewares/error-handler";
import { getUser } from "../controllers/user";
import { authenticateJWT } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.post("/users", userValidationRules, errorHandler, createUser);
userRoutes.get("/users/:id", authenticateJWT, getUser);

export default userRoutes;
