import React from 'react';
import { FileSystemProvider } from './context/FileSystemContext';
import FileTree from './components/FileTree';
import CodeEditor from './components/CodeEditor';
import ResizablePanel from './components/ResizablePanel';
import './App.css';

function App() {
  return (
    <FileSystemProvider>
      <div className="app">
        <div className="app-header">
          <h1>Cocoon Editor</h1>
          <p>All Scripting Requirements • One curl Away</p>
        </div>
        <div className="app-content">
          <ResizablePanel
            left={<FileTree />}
            right={<CodeEditor />}
            minLeftWidth={200}
            minRightWidth={400}
          />
        </div>
      </div>
    </FileSystemProvider>
  );
}

export default App;
