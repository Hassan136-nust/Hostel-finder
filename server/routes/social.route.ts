import express from "express";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";
import { addReview, getHostelReviews, replyToReview } from "../controllers/review.controller";
import { askQuestion, answerQuestion, getHostelQuestions } from "../controllers/question.controller";

const socialRouter = express.Router();

socialRouter.post("/add-review", isAuthenticated, addReview);
socialRouter.get("/reviews/:hostelId", getHostelReviews);
socialRouter.put("/reply-review", isAuthenticated, authorizeRoles("manager", "admin"), replyToReview);

socialRouter.post("/ask-question", isAuthenticated, askQuestion);
socialRouter.put("/answer-question", isAuthenticated, answerQuestion); 
socialRouter.get("/questions/:hostelId", getHostelQuestions);

export default socialRouter;