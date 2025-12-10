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
  - run: 'echo "current-directory: $(pwd)" >> storage/paths.yaml'
`
    },
    {
      id: '2',
      name: 'storage',
      type: 'directory',
      children: [
        {
          id: '3',
          name: 'paths.yaml',
          type: 'file',
          content: ``
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
  const [activeEditor, setActiveEditor] = useState(1); // 1 for left, 2 for right

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
        // In split view, open in the active editor (where cursor last was)
        if (activeEditor === 2) {
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
    } else {
      // Opening split view, set active editor to right (2) so next file opens there
      setActiveEditor(2);
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
        getAllFiles,
        activeEditor,
        setActiveEditor
      }}
    >
      {children}
    </FileSystemContext.Provider>
  );
};
