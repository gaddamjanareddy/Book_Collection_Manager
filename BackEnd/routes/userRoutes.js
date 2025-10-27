const Express = require("express");
const User = require("../models/User");
const { authenticateToken: authMiddleware } = require("../middleware/authMiddleware");

const router = Express.Router();

// GET ALL USERS
router.get("/", authMiddleware, async (req, res) => {
  try{
    const users = await User.find();
    res.json(users)
  }
  catch(err){
    res.status(500).json({ error: err.message });
  }
})

// GET profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// PUT profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) return res.status(404).json({ message: "User not found" });

    // Role update restrictions
    if (role) {
      if (currentUser.role === "student") {
        return res.status(403).json({ message: "Students cannot change role" });
      }

      if (currentUser.role === "admin" && !["admin", "student"].includes(role)) {
        return res.status(403).json({ message: "Admin can only change role to admin or student" });
      }

      // super_admin can change any role
      currentUser.role = role;
    }

    // Update username/email
    if (username) currentUser.username = username;
    if (email) currentUser.email = email;

    const updatedUser = await currentUser.save();

    res.json({
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
