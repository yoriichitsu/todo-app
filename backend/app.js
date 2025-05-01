const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // برای حل مشکل کور اضافه کردم

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://mongo:27017/todos', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Todo = mongoose.model('Todo', {
  text: String,
  done: Boolean
});

app.get('/todos', async (req, res) => {
  const todos = await Todo.find();
  res.json(todos);
});

app.post('/todos', async (req, res) => {
  const todo = new Todo(req.body);
  await todo.save();
  res.status(201).json(todo);
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, done } = req.body;

    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { text, done },
      { new: true }
    );

    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: 'Error updating todo', error });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTodo = await Todo.findByIdAndDelete(id);

    if (!deletedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }

    res.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting todo', error });
  }
});

app.listen(3000, () => console.log('Server is running on port 3000'));
