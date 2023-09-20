// pdfController.js

const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

exports.uploadPdf = (req, res) => {
    upload.single('pdf')(req, res, (err) => {
        if (err) {
            return res.status(500).send(err.message);
        }

        if (!req.file) {
            return res.status(400).send('No file uploaded');
        }
        
        const filepath = req.file.path;
        // Save filepath to MongoDB or do further processing
        res.status(200).send('File uploaded');
    });
};
