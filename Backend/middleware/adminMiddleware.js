export const adminOnly = (req, res, next) => {
    console.log("User Role:", req.user.role);
  if (req.user.role !== "admin") {
    return res.status(403).json({
      message: "Admin access only",
    });
  }
  next();
}; 