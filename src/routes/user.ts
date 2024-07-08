import { Router } from "express";
import { getUser } from "../controllers/user";
import { authenticateJWT } from "../middlewares/authMiddleware";

const userRoutes = Router();

userRoutes.get("/users/:id", authenticateJWT, getUser);

export default userRoutes;
