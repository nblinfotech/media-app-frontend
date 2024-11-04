import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, updateShareCount, incrementViewCount, uploadMedia } from '../redux/actions/mediaActions';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import Layout from './Layout';

const MediaList = () => {
  const dispatch = useDispatch();
  const media = useSelector((state) => state.media.mediaList);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);

  const handleMediaClick = (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowModal(true);
    dispatch(incrementViewCount(mediaItem._id)).then((updatedViewCount) => {
      // Update the selectedMedia state to reflect the new view count
      setSelectedMedia((prev) => ({
          ...prev,
          views: updatedViewCount // Assuming the updated view count is returned
      }));
  });
   
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  const handleShare = async () => {
    try {
      // Ensure selectedMedia exists and has an ID
      if (!selectedMedia || !selectedMedia._id) {
        throw new Error("Selected media is not defined.");
      }
  
      // Dispatch action to update share count and get the updated data
      const data = await dispatch(updateShareCount(selectedMedia._id));
      const { updatedShareCount, link } = data;
  
      // Update local state with the new share count
      setSelectedMedia((prevMedia) => ({
        ...prevMedia,
        shareCount: updatedShareCount,
      }));
  
      // Display success message
      toast.success('Link copied to clipboard!');
  
      // Check if Clipboard API is supported
      if (navigator.clipboard) {
        // Use Clipboard API
        await navigator.clipboard.writeText(link);
      } else {
        // Fallback for older browsers
        const tempInput = document.createElement('input');
        tempInput.value = link; // Use the link from the backend response
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
      }
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      toast.error('Failed to update share count. Please try again.');
    }
  };
  

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    toast.info(`${acceptedFiles.length} file(s) selected. Click "Upload" to proceed.`);
  };

  const handleUpload = async () => {
    // Validation: Check for at least one tag and one file
    if (files.length === 0) {
      toast.error('Please select at least one file to upload.');
      return;
    }
    if (tags.length === 0) {
      toast.error('Please add at least one tag.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append('file', file);
    });
    formData.append('tags', JSON.stringify(tags)); // Pass tags as JSON string

    setUploading(true);
    setUploadProgress(0);

    // Simulating a file upload with a progress bar
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10; // Increase progress by 10% for demo purposes
      });
    }, 200);

    try {
      await dispatch(uploadMedia(formData)); // Dispatch the upload action
      toast.success('Media uploaded successfully!');
      setTags([]); // Clear tags input after upload
      setTagInput(''); // Clear the input field
      setFiles([]); // Clear files after upload
      setShowUploadModal(false); // Close modal after upload
      setUploadProgress(0); // Reset upload progress
    } catch (error) {
      toast.error('Failed to upload media. Please try again.');
    } finally {
      setUploading(false); // Stop the dummy upload
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags((prevTags) => [...prevTags, tagInput.trim()]);
      setTagInput(''); // Clear input after adding tag
    }
  };

  const removeTag = (tagToRemove) => {
    setTags((prevTags) => prevTags.filter(tag => tag !== tagToRemove));
  };

  const resetDropzone = () => {
    setFiles([]); // Clear selected files
  };

  return (
    <Layout>
    <div className="container mt-5">
      <h2>Your Media</h2>

      <button className="btn btn-primary mb-4" onClick={() => setShowUploadModal(true)}>
        Upload Media
      </button>

      {/* Upload Media Modal */}
      {showUploadModal && (
        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Upload Media</h3>
            <Dropzone onDrop={handleDrop}>
              {({ getRootProps, getInputProps }) => (
                <div {...getRootProps()} className="dropzone">
                  <input {...getInputProps()} />
                  <p>Drag 'n' drop some files here, or click to select files</p>
                </div>
              )}
            </Dropzone>

            <div className="form-group mt-3">
              <label htmlFor="tags">Tags</label>
              <div className="tags-container mb-2">
                {tags.map((tag, index) => (
                  <span key={index} className="tag-pill">
                    {tag} <button className="remove-tag" onClick={() => removeTag(tag)}>×</button>
                  </span>
                ))}
              </div>
              <input
                type="text"
                id="tags"
                className="form-control"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Add a tag and press Enter"
                onKeyDown={(e) => e.key === 'Enter' && addTag()}
              />
            </div>

            {/* Display selected files with a close icon */}
            {files.length > 0 && (
              <div className="selected-files">
                <h5>Selected File:</h5>
                <ul className="list-group mb-2">
                  {files.map((file, index) => (
                    <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                      {file.name}
                      <button className="btn btn-danger btn-sm" onClick={resetDropzone}>
                        &times;
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button className="btn btn-success mt-3" onClick={handleUpload} >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>

            {uploading && (
              <div className="progress mt-3">
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${uploadProgress}%` }}
                  aria-valuenow={uploadProgress}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {uploadProgress}%
                </div>
              </div>
            )}

            <button className="btn btn-secondary mt-3" onClick={() => setShowUploadModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      <div className="row mt-4">
        {media.length > 0 ? (
          media.map((item) => (
            <div className="col-md-4 mb-4" key={item.id} onClick={() => handleMediaClick(item)}>
              <div className="card" style={{ height: '300px', cursor: 'pointer' }}>
                <div className="media-container">
                  {item.fileType === 'image' ? (
                    <img src={item.url} className="card-img-top" alt={item.name} />
                  ) : (
                    <video className="card-img-top">
                      <source src={item.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </div>
                <div className="card-body">
                <h5 className="card-title">
                    <span className="tags">
                      {item.tags && item.tags.map((tag, index) => (
                        <span key={index} className="tag">{`#${tag}`}{index < item.tags.length - 1 ? ',' : ''}</span>
                      ))}
                    </span>
                  </h5>           
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12">
            <p>No media uploaded yet.</p>
          </div>
        )}
      </div>

      {showModal && selectedMedia && (
        <div className="modal modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          
            <h3><span className="tags">
                      {selectedMedia.tags && selectedMedia.tags.map((tag, index) => (
                        <span key={index} className="tag">{`#${tag}`}{index < selectedMedia.tags.length - 1 ? ',' : ''}</span>
                      ))}
                    </span></h3>
            <div className="media-viewer">
              {selectedMedia.fileType === 'image' ? (
                <img src={selectedMedia.url} alt={selectedMedia.name} className="media-image" />
              ) : (
                <video controls className="media-video">
                  <source src={selectedMedia.url} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div className="media-stats">
              <span className="stats-item">
                <i className="fa fa-eye"></i> {selectedMedia.views || 0} views
              </span>
              <span className="stats-item">
                <i className="fa fa-send"></i> {selectedMedia.shareCount || 0} shares
              </span>
            </div>
            <button className="btn btn-primary mt-3" onClick={handleShare}>Share Link</button>
            {/* <button className="btn btn-secondary mt-3" onClick={handleCloseModal}>Close</button> */}
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 20px;
          border-radius: 8px;
          width: 80%;
          max-width: 500px;
          position: relative;
        }
        .dropzone {
          border: 2px dashed #007bff;
          border-radius: 5px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
        }
        .tags-container {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }
        .tag-pill {
          background: #007bff;
          color: white;
          border-radius: 15px;
          padding: 5px 10px;
          margin-right: 5px;
          display: flex;
          align-items: center;
        }
        .remove-tag {
          background: transparent;
          border: none;
          color: white;
          cursor: pointer;
          margin-left: 5px;
        }
        .progress {
          height: 20px;
          border-radius: 5px;
          overflow: hidden;
          background-color: #e0e0e0;
        }
        .progress-bar {
          height: 100%;
          background-color: #007bff;
          text-align: center;
          color: white;
        }
        .media-container {
  position: relative;
  overflow: hidden; /* Ensures content is not visible outside the container */
  height: 350px; /* Set a fixed height or percentage as needed */
}

.media-image, .media-video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* For images: cover the entire container */
}

.media-video {
  object-fit: cover; /* For videos: cover the entire container */
}
        .media-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 10px;
        }
        .stats-item {
          font-size: 0.9rem;
        }
        .selected-files {
          margin-top: 10px;
        }
        .selected-files .list-group-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
      `}</style>
    </div>
    </Layout>
  );
};

export default MediaList;
