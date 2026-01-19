import express from "express";
import { addReview, getHostelReviews, replyToReview, getUserReviews } from "../controllers/review.controller";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth";

const reviewRouter = express.Router();

reviewRouter.get("/get-reviews/:hostelId", getHostelReviews);

reviewRouter.get("/my-reviews", isAuthenticated, getUserReviews);

reviewRouter.post(
    "/add-review",
    isAuthenticated,
    addReview
);

reviewRouter.put(
    "/reply-review",
    isAuthenticated,
    authorizeRoles("manager", "admin"),
    replyToReview
);

export default reviewRouter;
