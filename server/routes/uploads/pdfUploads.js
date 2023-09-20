const express = require('express');
const router = express.Router();
const { uploadPdf } = require('../../controllers/PDF/pdfController');

router.post('/upload', uploadPdf);

module.exports = router;