import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useDispatch } from 'react-redux';
import { uploadFile } from '../redux/actions/mediaActions'; // Assuming you have an action for uploading

const UploadModal = ({ onClose }) => {
  const [tags, setTags] = useState('');
  const dispatch = useDispatch();

  const onDrop = (acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('tags', tags.split(',')); // Convert tags to an array

      dispatch(uploadFile(formData)); // Call the upload action
    });
    onClose(); // Close modal after uploading
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': []
    },
  });

  return (
    <div className="modal fade show" style={{ display: 'block' }} id="uploadModal" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Upload Media</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div {...getRootProps()} className="dropzone border border-dashed p-3 text-center">
              <input {...getInputProps()} />
              <p>Drag 'n' drop some files here, or click to select files (Images and Videos only)</p>
            </div>
            <div className="mt-3">
              <label htmlFor="tags">Tags (comma separated):</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Enter tags"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadModal;