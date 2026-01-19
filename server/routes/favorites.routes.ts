import express from "express";
import { addToFavorites, removeFromFavorites, getFavoriteRooms, checkFavorite } from "../controllers/favorites.controller";
import { isAuthenticated } from "../middlewares/auth";

const favoritesRouter = express.Router();

favoritesRouter.get("/favorites", isAuthenticated, getFavoriteRooms);

favoritesRouter.get("/favorites/check/:roomId", isAuthenticated, checkFavorite);

favoritesRouter.post("/favorites/add", isAuthenticated, addToFavorites);

favoritesRouter.delete("/favorites/remove/:roomId", isAuthenticated, removeFromFavorites);

export default favoritesRouter;
