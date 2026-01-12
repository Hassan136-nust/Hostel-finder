import express from "express";
import { authorizeRoles, isAuthenticated } from "../middlewares/auth";
import { getHostelAnalytics, getUserAnalytics } from "../controllers/analytics.controllers";

const analyticsRouter = express.Router();

analyticsRouter.get(
  "/get-users-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getUserAnalytics
);

analyticsRouter.get(
  "/get-hostels-analytics",
  isAuthenticated,
  authorizeRoles("admin"),
  getHostelAnalytics
);

export default analyticsRouter;