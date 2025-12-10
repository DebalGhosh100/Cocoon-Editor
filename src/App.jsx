import React from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import FileTree from './components/FileTree';
import EditorPanel from './components/EditorPanel';
import ResizablePanel from './components/ResizablePanel';
import './App.css';

import { Copy, X } from 'lucide-react';
import { useFileSystem } from './context/FileSystemContext';
import { useState } from 'react';

function AppContent() {
  const { fileSystem } = useFileSystem();
  const [showPopup, setShowPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLinuxCommand = (node, basePath = '.') => {
    let commands = [];
    
    if (node.type === 'directory') {
      const dirPath = basePath === '.' ? node.name : `${basePath}/${node.name}`;
      if (node.name !== 'root') {
        commands.push(`mkdir -p "${dirPath}"`);
      }
      if (node.children) {
        node.children.forEach(child => {
          commands = commands.concat(generateLinuxCommand(child, node.name === 'root' ? '.' : dirPath));
        });
      }
    } else if (node.type === 'file') {
      const filePath = `${basePath}/${node.name}`;
      const content = (node.content || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
      commands.push(`cat > "${filePath}" << 'EOF'\n${content}\nEOF`);
    }
    
    return commands;
  };
  
  const getFullCommand = () => {
    return generateLinuxCommand(fileSystem).join(' && ');
  };

  const cloneStructure = () => {
    setShowPopup(true);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    const command = getFullCommand();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    setCopied(false);
  };

  return (
    <div className="app">
      <div className="app-header">
        <h1>Cocoon Kickstart IDE</h1>
        <p>All Scripting Requirements • One curl Away</p>
      </div>
      <div className="app-content">
        <ResizablePanel
          left={<FileTree />}
          right={<EditorPanel />}
          minLeftWidth={200}
          minRightWidth={400}
        />
      </div>
      <div className="app-footer">
        <button
          className="download-btn"
          onClick={cloneStructure}
          title="Clone File Structure"
        >
          <Copy size={16} />
          <span>Clone Structure</span>
        </button>
      </div>

      {showPopup && (
        <div className="popup-overlay" onClick={closePopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Clone Structure Command</h3>
              <button className="close-btn" onClick={closePopup} title="Close">
                <X size={20} />
              </button>
            </div>
            <div className="popup-body">
              <p className="popup-description">
                Run this command in your terminal to create the directory structure and files:
              </p>
              <pre className="command-box">
                <code>{getFullCommand()}</code>
              </pre>
              <div className="popup-actions">
                <button 
                  className={`copy-command-btn ${copied ? 'copied' : ''}`}
                  onClick={copyToClipboard}
                  title="Copy to clipboard"
                >
                  <Copy size={16} />
                  <span>{copied ? 'Copied!' : 'Copy Command'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  return (
    <FileSystemProvider>
      <AppContent />
    </FileSystemProvider>
  );
}

export default App;
