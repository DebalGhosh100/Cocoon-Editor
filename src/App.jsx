import React from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import FileTree from './components/FileTree';
import EditorPanel from './components/EditorPanel';
import ResizablePanel from './components/ResizablePanel';
import './App.css';

import { Terminal, Copy, X } from 'lucide-react';
import { useFileSystem } from './context/FileSystemContext';
import { useState } from 'react';

function AppContent() {
  const { fileSystem } = useFileSystem();
  const [showCurlPopup, setShowCurlPopup] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateLinuxCommand = (node, basePath = '') => {
    let commands = [];
    
    if (node.type === 'directory') {
      // For root, don't create a directory or add to path
      if (node.name === 'root') {
        if (node.children) {
          node.children.forEach(child => {
            commands = commands.concat(generateLinuxCommand(child, ''));
          });
        }
      } else {
        // For non-root directories, create the directory and process children
        const dirPath = basePath ? `${basePath}/${node.name}` : node.name;
        commands.push(`mkdir -p "${dirPath}"`);
        if (node.children) {
          node.children.forEach(child => {
            commands = commands.concat(generateLinuxCommand(child, dirPath));
          });
        }
      }
    } else if (node.type === 'file') {
      const filePath = basePath ? `${basePath}/${node.name}` : node.name;
      const content = node.content || '';
      commands.push(`cat > "${filePath}" << 'EOF'\n${content}\nEOF`);
    }
    
    return commands;
  };
  
  const getFullCommand = () => {
    return generateLinuxCommand(fileSystem).join('\n');
  };

  const getCurlCommand = () => {
    const scriptContent = `#!/bin/bash\n\n# Cocoon Workflow Structure Setup Script\n# Generated from Cocoon Kickstart IDE\n\nset -e  # Exit on any error\n\necho "Creating workflow structure..."\n\n${getFullCommand()}\n\necho ""\necho "✓ Workflow structure created successfully!"\necho "Run 'cocoon main.yaml' to execute your workflow."\n`;
    
    const base64Content = btoa(unescape(encodeURIComponent(scriptContent)));
    return `echo "${base64Content}" | base64 -d | bash`;
  };

  const showCurlPopupHandler = () => {
    setShowCurlPopup(true);
    setCopied(false);
  };

  const closeCurlPopup = () => {
    setShowCurlPopup(false);
    setCopied(false);
  };

  const copyCurlCommand = async () => {
    try {
      await navigator.clipboard.writeText(getCurlCommand());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
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
          onClick={showCurlPopupHandler}
          className="download-btn"
          title="Get curl command"
        >
          <Terminal size={16} />
          <span>Curl Setup Script</span>
        </button>
      </div>

      {showCurlPopup && (
        <div className="popup-overlay" onClick={closeCurlPopup}>
          <div className="popup-content" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h3>Curl Setup Command</h3>
              <button className="close-btn" onClick={closeCurlPopup} title="Close">
                <X size={20} />
              </button>
            </div>
            <div className="popup-body">
              <p className="popup-description">
                Run this command in your terminal to create the entire workflow structure:
              </p>
              <pre className="command-box">
                <code>{getCurlCommand()}</code>
              </pre>
              <div className="popup-actions">
                <button 
                  className={`copy-command-btn ${copied ? 'copied' : ''}`}
                  onClick={copyCurlCommand}
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
