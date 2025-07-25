import express from "express";
import { Signup } from "../controllers/Signup.js";
import { Login } from "../controllers/Login.js";
import { googleLoginController } from "../controllers/google.js";

// import { auth, isPrimum, isAdmin } from "../middlewares/auth.js"; // Uncomment when ready

const router = express.Router();

router.post("/login", Login);
router.post("/signup", Signup);
router.post('/google-login',googleLoginController);


// Protected routes (optional, enable when needed)
/*
router.get("/premium", auth, isPrimum, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the protected premium route",
  });
});

router.get("/admin", auth, isAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to the protected admin route",
  });
});
*/

export default router;
