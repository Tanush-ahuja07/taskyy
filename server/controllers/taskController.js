import Task from '../models/Task.js';


export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const task = new Task({
      title,
      description,
      status: status || 'pending',
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
};

// Update a task
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const task = await Task.findOne({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (title) task.title = title;
    if (description !== undefined) task.description = description;
    if (status) task.status = status;

    await task.save();
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
};

// Delete a task
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findOneAndDelete({ _id: id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
};
