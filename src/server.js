const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Fast health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Simulated API endpoint with variable latency
app.get('/api/users', (req, res) => {
  const simulatedLatency = Math.floor(Math.random() * 100) + 20; // 20ms - 120ms delay
  setTimeout(() => {
    res.status(200).json({
      count: 2,
      users: [
        { id: 1, name: 'Alice', role: 'Tester' },
        { id: 2, name: 'Bob', role: 'Developer' }
      ]
    });
  }, simulatedLatency);
});

app.listen(PORT, () => {
  console.log(`Dummy API server listening on http://localhost:${PORT}`);
});
