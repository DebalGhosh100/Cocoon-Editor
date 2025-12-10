import React, { createContext, useContext, useState } from 'react';

const FileSystemContext = createContext();

export const useFileSystem = () => {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error('useFileSystem must be used within FileSystemProvider');
  }
  return context;
};

const initialFileSystem = {
  id: 'root',
  name: 'root',
  type: 'directory',
  children: [
    {
      id: '1',
      name: 'main.yaml',
      type: 'file',
      content: `blocks:
  - name: "Example Sequential Block"
    description: "This demonstrates basic sequential execution"
    run: echo "Hello from Cocoon!"
  
  - name: "Use Variables from Storage"
    description: "Access configuration from storage/config.yaml"
    run: echo "App Name: \${config.app.name}"
  
  - name: "Parallel Example"
    parallel:
      - name: "Task 1"
        run: echo "Running task 1"
      - name: "Task 2"
        run: echo "Running task 2"
`
    },
    {
      id: '2',
      name: 'storage',
      type: 'directory',
      children: [
        {
          id: '3',
          name: 'config.yaml',
          type: 'file',
          content: `app:
  name: "MyWorkflow"
  version: "1.0.0"
  environment: "production"

database:
  host: "localhost"
  port: 5432
  name: "mydb"
  credentials:
    username: "admin"
    password: "secret"

paths:
  logs: "./logs"
  data: "./data"
  backups: "./backups"
  temp: "./temp"

servers:
  web:
    ip: "192.168.1.10"
    user: "deploy"
    pass: "deploy123"
  api:
    ip: "192.168.1.11"
    user: "deploy"
    pass: "deploy123"
`
        },
        {
          id: '4',
          name: 'servers.yaml',
          type: 'file',
          content: `production:
  server1:
    ip: "10.0.1.10"
    user: "admin"
    pass: "password123"
  server2:
    ip: "10.0.1.11"
    user: "admin"
    pass: "password123"

staging:
  server1:
    ip: "10.0.2.10"
    user: "admin"
    pass: "password123"
`
        }
      ]
    }
  ]
};

let nextId = 100;

export const FileSystemProvider = ({ children }) => {
  const [fileSystem, setFileSystem] = useState(initialFileSystem);
  const [selectedFile, setSelectedFile] = useState(() => {
    // Select main.yaml by default
    const mainYaml = initialFileSystem.children.find(child => child.name === 'main.yaml');
    return mainYaml || null;
  });
  const [selectedFile2, setSelectedFile2] = useState(null);
  const [splitView, setSplitView] = useState(false);

  const findNodeById = (tree, id) => {
    if (tree.id === id) return tree;
    if (tree.children) {
      for (let child of tree.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const findParentById = (tree, id, parent = null) => {
    if (tree.id === id) return parent;
    if (tree.children) {
      for (let child of tree.children) {
        const found = findParentById(child, id, tree);
        if (found) return found;
      }
    }
    return null;
  };

  const addNode = (parentId, type) => {
    const newNode = {
      id: String(nextId++),
      name: type === 'file' ? 'newfile.yaml' : 'newfolder',
      type,
      ...(type === 'file' ? { content: '' } : { children: [] })
    };

    setFileSystem(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const parent = findNodeById(newTree, parentId);
      if (parent && parent.type === 'directory') {
        if (!parent.children) parent.children = [];
        parent.children.push(newNode);
      }
      return newTree;
    });

    return newNode.id;
  };

  const deleteNode = (id) => {
    if (id === 'root') return;

    setFileSystem(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const parent = findParentById(newTree, id);
      if (parent && parent.children) {
        parent.children = parent.children.filter(child => child.id !== id);
      }
      return newTree;
    });

    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const updateNodeContent = (id, content) => {
    setFileSystem(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const node = findNodeById(newTree, id);
      if (node && node.type === 'file') {
        node.content = content;
      }
      return newTree;
    });
  };

  const renameNode = (id, newName) => {
    setFileSystem(prev => {
      const newTree = JSON.parse(JSON.stringify(prev));
      const node = findNodeById(newTree, id);
      if (node) {
        node.name = newName;
      }
      return newTree;
    });
  };

  const selectFile = (id) => {
    const node = findNodeById(fileSystem, id);
    if (node && node.type === 'file') {
      if (!splitView) {
        setSelectedFile(node);
      } else {
        // In split view, alternate between left and right panels
        if (!selectedFile2) {
          setSelectedFile2(node);
        } else {
          setSelectedFile(node);
        }
      }
    }
  };

  const toggleSplitView = () => {
    if (splitView) {
      // Closing split view, keep only the left file
      setSelectedFile2(null);
    }
    setSplitView(!splitView);
  };

  const getAllFiles = () => {
    const files = [];
    const traverse = (node) => {
      if (node.type === 'file') {
        files.push(node);
      }
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    traverse(fileSystem);
    return files;
  };

  return (
    <FileSystemContext.Provider
      value={{
        fileSystem,
        selectedFile,
        selectedFile2,
        splitView,
        addNode,
        deleteNode,
        updateNodeContent,
        renameNode,
        selectFile,
        setSelectedFile,
        setSelectedFile2,
        toggleSplitView,
        getAllFiles
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
