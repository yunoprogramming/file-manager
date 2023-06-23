import React, { useState, useEffect } from 'react';
import { data } from './data';
import { Header } from './components/Header';
import { AudioPlayer } from './components/AudioPlayer';
import { DocumentViewer } from './components/DocumentViewer';
import { VideoPlayer } from './components/VideoPlayer';
import { ImageViewer } from './components/ImageViewer';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function App() {
  // State variables
  const [myFiles, setMyFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePath, setFilePath] = useState("/file-server/");
  const [showChartModal, setShowChartModal] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [filteredFiles, setFilteredFiles] = useState([]);

  useEffect(() => {
    // Set initial state for myFiles from data
    setMyFiles(data);
  }, []);

  useEffect(() => {
    // Filter files based on searchKeyword
    if (searchKeyword === "") {
      setFilteredFiles(myFiles);
    } else {
      const filtered = myFiles.filter((file) =>
        file.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
      setFilteredFiles(filtered);
    }
  }, [searchKeyword, myFiles]);

  const handleDelete = (e, file) => {
    // Handle file deletion
    e.stopPropagation();
    const updatedFiles = myFiles.filter((f) => f.id !== file.id);
    setMyFiles(updatedFiles);
  };

  const handleFileUpload = (e) => {
    // Handle file upload
    const uploadedFile = e.target.files[0];
    const fileId = Math.random().toString(36).substr(2, 9);
    const newFile = {
      id: fileId,
      name: uploadedFile.name,
      type: determineFileType(uploadedFile.name),
      path: `/file-server/${uploadedFile.name}`,
    };

    setMyFiles([...myFiles, newFile]);
  };

  const determineFileType = (fileName) => {
    // Determine file type based on file extension
    const extension = fileName.split(".").pop();
    if (
      extension === "mp4" ||
      extension === "mov" ||
      extension === "avi"
    ) {
      return "video";
    } else if (
      extension === "mp3" ||
      extension === "wav" ||
      extension === "ogg"
    ) {
      return "audio";
    } else if (
      extension === "doc" ||
      extension === "docx" ||
      extension === "pdf"
    ) {
      return "document";
    } else if (
      extension === "jpg" ||
      extension === "jpeg" ||
      extension === "png" ||
      extension === "gif"
    ) {
      return "image";
    } else {
      return "other";
    }
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Files Breakdown',
      },
    },
  };

  return (
    <>
      {showChartModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <p style={{ fontWeight: 'bold' }}>Files Breakdown</p>
              <button
                style={styles.closeButton}
                onClick={() => setShowChartModal(false)}
              >
                close
              </button>
            </div>
            <div style={styles.modalBody}>
              <Pie
                data={{
                  labels: [
                    'Video',
                    'Audio',
                    'Document',
                    'Image',
                    'Other',
                  ],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [
                        filteredFiles.filter(
                          (file) => file.type === 'video'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'audio'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'document'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'image'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'other'
                        ).length,
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(201, 203, 207, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(201, 203, 207, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
              />
              <Bar
                data={{
                  labels: [
                    'Video',
                    'Audio',
                    'Document',
                    'Image',
                    'Other',
                  ],
                  datasets: [
                    {
                      label: 'Files Breakdown',
                      data: [
                        filteredFiles.filter(
                          (file) => file.type === 'video'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'audio'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'document'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'image'
                        ).length,
                        filteredFiles.filter(
                          (file) => file.type === 'other'
                        ).length,
                      ],
                      backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(201, 203, 207, 0.2)',
                      ],
                      borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(201, 203, 207, 1)',
                      ],
                      borderWidth: 1,
                    },
                  ],
                }}
                options={barChartOptions}
              />
            </div>
          </div>
        </div>
      )}
      <div className="App">
        <Header />
        <div style={styles.container}>
        <div style={{ padding: 10 }}>
          <input
            type="text"
            placeholder="Search files"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <input
            type="file"
            onChange={handleFileUpload}
          />
        </div>
          <div style={{ padding: 10, paddingBottom: 0 }}>
            <p style={{ fontWeight: 'bold' }}>My Files</p>
            <p>{selectedFile ? selectedFile.path : filePath}</p>
          </div>
          <div style={styles.controlTools}>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  const newFiles = myFiles.map((file) => {
                    if (file.id === selectedFile.id) {
                      return {
                        ...file,
                        name: prompt('Enter new name'),
                      };
                    }
                    return file;
                  });
                  setMyFiles(newFiles);
                  setSelectedFile(null);
                }
              }}
            >
              Rename
            </button>
            <button
              style={styles.controlButton}
              onClick={() => {
                setShowChartModal(true);
              }}
            >
              Files Breakdown
            </button>
            <button
              style={styles.controlButton}
              onClick={() => {
                if (selectedFile) {
                  window.open(selectedFile.path, '_blank');
                }
              }}
            >
              Download
            </button>
          </div>
          <div style={styles.fileContainer}>
            <div style={{ width: '100%', padding: 10 }}>
              {filteredFiles.map((file) => {
                if (file.path.slice(0, filePath.length) === filePath) {
                  return (
                    <div
                      style={styles.file}
                      className="files"
                      key={file.id}
                      onClick={() => {
                        if (selectedFile && selectedFile.id === file.id) {
                          setSelectedFile(null);
                          return;
                        }
                        setSelectedFile(file);
                      }}
                    >
                      <p>{file.name}</p>
                      <button onClick={(e) => handleDelete(e, file)}>
                        Delete
                      </button>
                    </div>
                  );
                }
              })}
            </div>
            {selectedFile && (
              <div style={styles.fileViewer}>
                {selectedFile.type === 'video' && (
                  <VideoPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'audio' && (
                  <AudioPlayer path={selectedFile.path} />
                )}
                {selectedFile.type === 'document' && (
                  <DocumentViewer path={selectedFile.path} />
                )}
                {selectedFile.type === 'image' && (
                  <ImageViewer path={selectedFile.path} />
                )}
                <p style={{ fontWeight: 'bold', marginTop: 10 }}>
                  {selectedFile.name}
                </p>
                <p>
                  path:{' '}
                  <span style={{ fontStyle: 'italic' }}>
                    {selectedFile.path}
                  </span>
                </p>
                <p>
                  file type:{' '}
                  <span style={{ fontStyle: 'italic' }}>
                    {selectedFile.type}
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

const styles = {
  container: {
    backgroundColor: '#fff',
    color: '#000',
  },
  fileContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  file: {
    backgroundColor: '#eee',
    padding: '10px',
    marginBottom: '10px',
    cursor: 'pointer',
    width: '100%',
  },
  fileViewer: {
    padding: '10px',
    margin: '10px',
    width: '30vw',
    height: '100vh',
    cursor: 'pointer',
    borderLeft: '1px solid #ccc',
  },
  controlTools: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: '10px',
  },
  controlButton: {
    marginRight: '10px',
  },
  modal: {
    position: 'fixed',
    zIndex: '1',
    left: '0',
    top: '0',
    width: '100%',
    height: '100%',
    overflow: 'auto',
    backgroundColor: 'rgba(0,0,0,0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fefefe',
    margin: 'auto',
    padding: '20px',
    border: '1px solid #888',
    width: '80%',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '10px',
  },
  closeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    textAlign: 'center',
    textDecoration: 'none',
    display: 'inline-block',
    fontSize: '16px',
    margin: '4px 2px',
    cursor: 'pointer',
    borderRadius: '4px',
  },
  modalBody: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
};

