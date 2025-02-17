import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMedia, updateShareCount, incrementViewCount, uploadMedia } from '../redux/actions/mediaActions';
import Dropzone from 'react-dropzone';
import { toast } from 'react-toastify';
import Layout from './Layout';
import './MediaList.css';

const MediaList = () => {
  const dispatch = useDispatch();
  const media = useSelector((state) => state.media.mediaList);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    dispatch(fetchMedia());
  }, [dispatch]);

  const handleMediaClick = async (mediaItem) => {
    setSelectedMedia(mediaItem);
    setShowModal(true);
    try {
      const updatedViewCount = await dispatch(incrementViewCount(mediaItem._id));
      setSelectedMedia((prev) => ({ ...prev, views: updatedViewCount }));
    } catch (error) {
      console.error('Failed to increment view count:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMedia(null);
  };

  const handleShare = async () => {
    if (!selectedMedia) return;

    try {
      const { updatedShareCount, link } = await dispatch(updateShareCount(selectedMedia._id));
      setSelectedMedia((prev) => ({ ...prev, shareCount: updatedShareCount }));
      navigator.clipboard.writeText(link);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to update share count.');
    }
  };

  const handleDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
    toast.info(`${acceptedFiles.length} file(s) selected.`);
  };

  const handleUpload = async () => {
    if (!files.length || !tags.length) {
      toast.error('Please select files and add at least one tag.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => formData.append('file', file));
    formData.append('tags', JSON.stringify(tags));

    setUploading(true);
    setUploadProgress(0);

    try {
      await dispatch(uploadMedia(formData));
      toast.success('Media uploaded successfully!');
      setTags([]);
      setFiles([]);
      setShowUploadModal(false);
    } catch (error) {
      toast.error('Upload failed.');
    } finally {
      setUploading(false);
      setUploadProgress(100);
    }
  };

  return (
    <Layout>
      <div className="container mt-5">
        <h2>Your Media</h2>
        <button className="btn btn-primary mb-4" onClick={() => setShowUploadModal(true)}>
          Upload Media
        </button>

        {showUploadModal && (
          <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>Upload Media</h3>
              <Dropzone onDrop={handleDrop}>
                {({ getRootProps, getInputProps }) => (
                  <div {...getRootProps()} className="dropzone">
                    <input {...getInputProps()} />
                    <p>Drag & drop files or click to select</p>
                  </div>
                )}
              </Dropzone>

              <div className="form-group mt-3">
                <label htmlFor="tags">Tags</label>
                <div className="tags-container">
                  {tags.map((tag, index) => (
                    <span key={index} className="tag">
                      {tag} <button onClick={() => setTags(tags.filter((t) => t !== tag))}>×</button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && setTags([...tags, tagInput])}
                />
              </div>

              <button className="btn btn-success mt-3" onClick={handleUpload}>
                {uploading ? 'Uploading...' : 'Upload'}
              </button>

              {uploading && (
                <div className="progress mt-3">
                  <div className="progress-bar" style={{ width: `${uploadProgress}%` }}>
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
          {media.length ? (
            media.map((item) => (
              <div className="col-md-4 mb-4" key={item.id} onClick={() => handleMediaClick(item)}>
                <div className="card media-card">
                  {item.fileType === 'image' ? (
                    <img src={item.url} className="card-img-top" alt={item.name} />
                  ) : (
                    <video className="card-img-top" controls>
                      <source src={item.url} type="video/mp4" />
                    </video>
                  )}
                  <div className="card-body">
                    <h5 className="tags">
                      {item.tags?.map((tag, index) => (
                        <span key={index} className="tag">#{tag} </span>
                      ))}
                    </h5>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No media uploaded yet.</p>
          )}
        </div>

        {showModal && selectedMedia && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h3>{selectedMedia.name}</h3>
              <div className="media-viewer">
                {selectedMedia.fileType === 'image' ? (
                  <img src={selectedMedia.url} alt={selectedMedia.name} className="media-image" />
                ) : (
                  <video controls className="media-video">
                    <source src={selectedMedia.url} type="video/mp4" />
                  </video>
                )}
              </div>
              <div className="media-stats">
                <span><i className="fa fa-eye"></i> {selectedMedia.views || 0} views</span>
                <button className="btn btn-info" onClick={handleShare}>
                  Share
                </button>
              </div>
              <button className="btn btn-secondary" onClick={handleCloseModal}>
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MediaList;
