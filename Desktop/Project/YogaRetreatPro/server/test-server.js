const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test registration endpoint
app.post('/api/auth/register', (req, res) => {
  console.log('Registration request received:', req.body);
  
  // Простая проверка данных
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  // Здесь должна быть логика регистрации пользователя
  // Пока просто возвращаем успех
  res.json({ message: 'Registration successful' });
});

app.listen(PORT, () => {
  console.log(`Test server is running on http://localhost:${PORT}`);
});
