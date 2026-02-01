export const authMe = async (req, res) => {
  try {
    const user = req.user; // user info attached by auth middleware

    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching authenticated user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
