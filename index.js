const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // no larger than 5mb, you can change as needed.
  },
});

app.use(express.static("public"));
// File upload endpoint
app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }
  res.send("File uploaded successfully");
});

// File download endpoint
app.get("/download/:filename", (req, res) => {
  const fileName = req.params.filename;
  const file = path.join(__dirname, "data", fileName);
  res.download(file);
});

// Get file names endpoint
app.get("/files", (req, res) => {
  const folderPath = path.join(__dirname, "data");
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error fetching file list");
    }
    const textFiles = files.filter((file) => path.extname(file) === ".txt");
    res.json(textFiles);
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
