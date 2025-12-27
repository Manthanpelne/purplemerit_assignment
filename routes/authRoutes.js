const { signup, login, refreshToken, logout } = require("../controllers/authController")
const protect = require("../middlewares/authMiddleware")
const router = require("express").Router()
//Auth Routes
router.post("/sign-up",signup)
router.post("/login",login)

router.post("/refresh-token", refreshToken)

router.post("logout",protect,logout)

module.exports = router
