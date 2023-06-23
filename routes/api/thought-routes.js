const router = require('express').Router();
const { Thought } = require('../../models');

// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find().populate('reactions');
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single thought by _id
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id).populate('reactions');
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    res.status(201).json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// PUT to update a thought by _id
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(400).json(err);
  }
});

// DELETE to remove a thought by _id
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }
    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// POST to create a reaction to a thought
router.post('/:thoughtId/reactions', async (req, res) => {
  try {
    const { thoughtId } = req.params;
    const { reactionBody, username } = req.body;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $push: {
          reactions: { reactionBody, username },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE to remove a reaction from a thought
router.delete('/:thoughtId/reactions/:reactionId', async (req, res) => {
  try {
    const { thoughtId, reactionId } = req.params;

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $pull: {
          reactions: { reactionId },
        },
      },
      { new: true }
    );

    if (!updatedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.json(updatedThought);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
