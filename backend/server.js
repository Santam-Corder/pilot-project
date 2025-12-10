const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = "santam-secret-key-change-this-in-prod";
const DATA_FILE = path.join(__dirname, 'tasks.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '../'))); // Serves index.html, test 8.html


// Users (Matching the frontend)
const authorizedUsers = [
    { id: 1, email: "admin@berkeleyuae.com", password: "Santam@123", name: "Developer", role: "admin" },
    { id: 2, email: "sec@berkeleyuae.com", password: "sec@123", name: "Security Division", role: "user", dept: "security" },
    { id: 3, email: "mep@berkeleyuae.com", password: "mep@123", name: "Maintenance Division", role: "user", dept: "maintenance" },
    { id: 4, email: "lsd@berkeleyuae.com", password: "lsd@123", name: "Landscaping Division", role: "user", dept: "landscaping" },
    { id: 5, email: "cln@berkeleyuae.com", password: "cln@123", name: "Cleaning Division", role: "user", dept: "cleaning" },
    { id: 6, email: "lau@berkeleyuae.com", password: "lau@123", name: "Laundry Division", role: "user", dept: "laundry" },
    { id: 7, email: "fm@berkeleyuae.com", password: "fm@123", name: "FM Divsion", role: "user", dept: "facilities" }
];

// Helper to read tasks
function getTasks() {
    if (!fs.existsSync(DATA_FILE)) {
        return [];
    }
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading data file:", err);
        return [];
    }
}

// Helper to save tasks
function saveTasks(tasks) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(tasks, null, 2));
}

// --- Routes ---

// Login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    const user = authorizedUsers.find(u => u.email === email && u.password === password);

    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email, name: user.name, role: user.role, dept: user.dept }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role, dept: user.dept } });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Get all tasks
app.get('/api/tasks', (req, res) => {
    const tasks = getTasks();
    res.json(tasks);
});

// Create task
app.post('/api/tasks', (req, res) => {
    const tasks = getTasks();
    const newTask = req.body;

    // Server-side validation or ID generation could happen here
    // For now we trust the client's structure but ensure we save it
    tasks.push(newTask);
    saveTasks(tasks);

    res.status(201).json(newTask);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const tasks = getTasks();
    const taskId = req.params.id;
    const updates = req.body;

    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        saveTasks(tasks);
        res.json(tasks[taskIndex]);
    } else {
        res.status(404).json({ message: "Task not found" });
    }
});

// Delete task
app.delete('/api/tasks/:id', (req, res) => {
    let tasks = getTasks();
    const taskId = req.params.id;

    const newTasks = tasks.filter(t => t.id !== taskId);
    saveTasks(newTasks);

    res.json({ success: true });
});

// Clear all tasks (Admin only, technically)
app.delete('/api/tasks', (req, res) => {
    saveTasks([]);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
