// PDFViewDialog.js
import React from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Document, Page } from "react-pdf";

const PDFViewDialog = ({ open, onClose, pdfContent }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md">
      <DialogTitle>View PDF Notes</DialogTitle>
      <DialogContent>
        <div style={{ width: "100%" }}>
          <Document file={pdfContent}>
            <Page pageNumber={1} />
          </Document>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PDFViewDialog;
