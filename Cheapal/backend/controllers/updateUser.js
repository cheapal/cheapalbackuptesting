const User = require('../models/User');

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, password, avatar, country, paymentMethods, role } = req.body;

    // Find user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password; // Consider hashing again if password is provided
    if (avatar) user.avatar = avatar;
    if (country) user.country = country;
    if (paymentMethods) user.paymentMethods = paymentMethods;
    if (role) user.role = role;

    // Save updated user
    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
