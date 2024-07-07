import { Router } from "express";
import {
  createOrganisation,
  getOrganisations,
  getOrganisation,
  addUserToOrganisation,
} from "../controllers/organization";

import { authenticateJWT } from "../middlewares/authMiddleware";
import { errorHandler } from "../middlewares/error-handler";

const orgRoutes = Router();

orgRoutes.post(
  "/organisations",
  authenticateJWT,
  errorHandler,
  createOrganisation
);
orgRoutes.get("/organisations", authenticateJWT, getOrganisations);
orgRoutes.get("/organisations/:orgId", authenticateJWT, getOrganisation);
orgRoutes.post("/:orgId/users", authenticateJWT, addUserToOrganisation);

export default orgRoutes;
