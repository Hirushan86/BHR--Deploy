// THIS FILE WILL BE MOVED TO DIFFRENT LOCATION
// CURRENTLY IN THIS LOCATION TO TEST THE FUNCTION AND USABILITY 

import React, { useState } from 'react';
import axios from 'axios';

const UploadComponent = () => {
  const [file, setFile] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  }

  const onUpload = async () => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await axios.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('File Uploaded', response.data);
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      <button onClick={onUpload}>Upload</button>
    </div>
  );
}

export default UploadComponent;
