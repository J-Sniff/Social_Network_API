const { Thought, User } = require("../models");

const thoughtController = {
  getThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.find().sort({ createdAt: -1 });
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  getSingleThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId });
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  createThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.create(req.body);
      const dbUserData = await User.findOneAndUpdate(
        { _id: req.body.userId },
        { $push: { thoughts: dbThoughtData._id } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: "Thought was created but no user with id" });
      }
      res.json({ message: "Thought successfully created!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  updateThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  deleteThought: async (req, res) => {
    try {
      const dbThoughtData = await Thought.findOneAndRemove({ _id: req.params.thoughtId });
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id" });
      }
      const dbUserData = await User.findOneAndUpdate(
        { thoughts: req.params.thoughtId },
        { $pull: { thoughts: req.params.thoughtId } },
        { new: true }
      );
      if (!dbUserData) {
        return res.status(404).json({ message: "Thought was created but no user with id" });
      }
      res.json({ message: "Thought successfully deleted!" });
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  addReaction: async (req, res) => {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  },

  removeReaction: async (req, res) => {
    try {
      const dbThoughtData = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
      );
      if (!dbThoughtData) {
        return res.status(404).json({ message: "No thought with this id" });
      }
      res.json(dbThoughtData);
    } catch (err) {
      console.log(err);
      res.status(500).json(err);
    }
  }
};

module.exports = thoughtController;
