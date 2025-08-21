import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 5000;

const API_BASE = "https://api.recruitment.shq.nz";
const API_KEY = "h523hDtETbkJ3nSJL323hjYLXbCyDaRZ";

// Allow CORS for your frontend
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  next();
});

// Get domain by ID
app.get("/api/domain/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${API_BASE}/domains/${id}?api_key=${API_KEY}`);
    if (!response.ok) {
      const text = await response.text();
      console.error(`Domain API error: ${text}`);
      throw new Error(`Domain API failed with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Get zone by URI (e.g., /zones/1)
app.get("/api/zones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const response = await fetch(`${API_BASE}/zones/${id}?api_key=${API_KEY}`);
    if (!response.ok) {
      const text = await response.text();
      console.error(`Zone API error: ${text}`);
      throw new Error(`Zone API failed with status ${response.status}`);
    }
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
 