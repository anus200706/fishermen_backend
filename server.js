const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors()); 
app.use(express.json()); 

// MongoDB Connection
mongoose.connect('mongodb+srv://anushkatesu_db_user:Pz7gzpnYzP2cbLku@cluster0.0zwdnqz.mongodb.net/?appName=Cluster0')
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err));

// Schema Definition
const reportSchema = new mongoose.Schema({
    aadhaar: String,
    category: String,
    description: String,
    location: { type: String, required: true }, // Stores "Lat, Lng"
    status: { type: String, default: "Pending" },
    date: { type: Date, default: Date.now }
});
const Report = mongoose.model('Report', reportSchema);

// POST: Save a new report
app.post('/api/report', async (req, res) => {
    try {
        const newReport = new Report(req.body);
        await newReport.save();
        res.status(200).json({ message: "Report pinned to the map!" });
    } catch (err) {
        res.status(500).json({ error: "Failed to save report" });
    }
});

// GET: Fetch all reports
app.get('/api/reports', async (req, res) => {
    try {
        const allReports = await Report.find().sort({ date: -1 });
        res.status(200).json(allReports);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch reports" });
    }
});

// PUT: Update report status
app.put('/api/report/:id', async (req, res) => {
    try {
        await Report.findByIdAndUpdate(req.params.id, { status: 'Resolved' });
        res.status(200).json({ message: "Status updated" });
    } catch (err) {
        res.status(500).json({ error: "Update failed" });
    }
});

app.listen(3000, () => {
    console.log("🚀 CoastalCare Server running on http://localhost:3000");
});