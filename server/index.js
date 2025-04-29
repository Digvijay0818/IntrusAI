const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csvtojson');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file?.path;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const jsonArray = await csv().fromFile(file);
    for(let i=0;i<jsonArray.length;i++){
        
    jsonArray[i]['Fwd Header Length']=0;
    jsonArray[i]['Fwd Header Length.1']=23;
    }
    console.log("✅ Parsed CSV Data:", jsonArray); // log first 2 rows

    // Send the entire CSV JSON to Flask
    const response = await axios.post('http://127.0.0.1:5000/predict', jsonArray);
    const result = response.data;

    console.log("✅ ML API response:", result);

    res.json({ success: true, result });
  } catch (err) {
    console.error("❌ Error in /upload route:", err);
    res.status(500).json({ error: err.message || "Internal Server Error" });
  }
});

app.get('/', (req, res) => {
  res.send("🚀 IDS API is up and running!");
});

app.listen(4000, () => console.log("🚀 IDS API running on http://localhost:4000"));
