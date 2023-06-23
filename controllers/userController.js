const { User, Thought } = require('../models');

const userController = {
  getUsers: async (req, res) => {
    try {
      const dbUserData = await User.find().select('-__v');
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  getSingleUser: async (req, res) => {
    try {
      const dbUserData = await User.findOne({ _id: req.params.userId })
        .select('-__v')
        .populate('friends')
        .populate('thoughts');
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  createUser: async (req, res) => {
    try {
      const dbUserData = await User.create(req.body);
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updateUser: async (req, res) => {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  deleteUser: async (req, res) => {
    try {
      const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id' });
      }
      await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
      res.json({ message: 'User and thoughts deleted successfully' });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  addFriend: async (req, res) => {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $addToSet: { friends: req.params.friendId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  removeFriend: async (req, res) => {
    try {
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $pull: { friends: req.params.friendId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: 'No user with this id' });
      }
      res.json(dbUserData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};

module.exports = userController;
