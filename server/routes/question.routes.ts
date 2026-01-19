import express from "express";
import { askQuestion, answerQuestion, getHostelQuestions, getUserQuestions } from "../controllers/question.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const questionRouter = express.Router();

questionRouter.get("/get-hostel-questions/:hostelId", getHostelQuestions);

questionRouter.get("/my-questions", isAuthenticated, getUserQuestions);

questionRouter.post(
    "/ask-question",
    isAuthenticated,
    askQuestion
);

questionRouter.put(
    "/answer-question",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    answerQuestion
);

export default questionRouter;
