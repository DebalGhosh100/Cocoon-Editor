import React from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import FileTree from './components/FileTree';
import EditorPanel from './components/EditorPanel';
import ResizablePanel from './components/ResizablePanel';
import './App.css';

import { Download } from 'lucide-react';
import { useFileSystem } from './context/FileSystemContext';

function AppContent() {
  const { fileSystem } = useFileSystem();

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
      const content = (node.content || '').replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/\$/g, '\\$').replace(/`/g, '\\`');
      commands.push(`cat > "${filePath}" << 'EOF'\n${content}\nEOF`);
    }
    
    return commands;
  };
  
  const getFullCommand = () => {
    return generateLinuxCommand(fileSystem).join('\n');
  };

  const cloneStructure = () => {
    // Generate bash script content
    const scriptContent = `#!/bin/bash\n\n# Cocoon Workflow Structure Setup Script\n# Generated from Cocoon Kickstart IDE\n\nset -e  # Exit on any error\n\necho "Creating workflow structure..."\n\n${getFullCommand()}\n\necho ""\necho "✓ Workflow structure created successfully!"\necho "Run 'cocoon main.yaml' to execute your workflow."\n`;
    
    // Create blob and download
    const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'setup-workflow.sh';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
          title="Download setup script"
        >
          <Download size={16} />
          <span>Download Setup Script</span>
        </button>
      </div>


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
