import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2 } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';
import './FileTree.css';

const TreeNode = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const { selectedFile, selectFile, addNode, deleteNode } = useFileSystem();

  const isSelected = selectedFile?.id === node.id;
  const isDirectory = node.type === 'directory';

  const handleClick = () => {
    if (isDirectory) {
      setIsExpanded(!isExpanded);
    } else {
      selectFile(node.id);
    }
  };

  const handleAddFile = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      addNode(node.id, 'file');
      setIsExpanded(true);
    }
  };

  const handleAddFolder = (e) => {
    e.stopPropagation();
    if (isDirectory) {
      addNode(node.id, 'directory');
      setIsExpanded(true);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (node.id !== 'root') {
      deleteNode(node.id);
    }
  };

  return (
    <div className="tree-node">
      <div
        className={`tree-node-content ${isSelected ? 'selected' : ''}`}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true);
          setShowActions(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowActions(false);
        }}
      >
        <div className="tree-node-label">
          {isDirectory && (
            <span className="tree-node-icon">
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </span>
          )}
          <span className="tree-node-icon">
            {isDirectory ? (
              isExpanded ? <FolderOpen size={16} /> : <Folder size={16} />
            ) : (
              <File size={16} />
            )}
          </span>
          <span className="tree-node-name">{node.name}</span>
        </div>
        
        {showActions && (
          <div className="tree-node-actions">
            {isDirectory && (
              <>
                <button
                  className="tree-action-btn"
                  onClick={handleAddFile}
                  title="Add File"
                >
                  <File size={14} />
                  <Plus size={10} className="plus-icon" />
                </button>
                <button
                  className="tree-action-btn"
                  onClick={handleAddFolder}
                  title="Add Folder"
                >
                  <Folder size={14} />
                  <Plus size={10} className="plus-icon" />
                </button>
              </>
            )}
            {node.id !== 'root' && (
              <button
                className="tree-action-btn delete"
                onClick={handleDelete}
                title="Delete"
              >
                <Trash2 size={14} />
              </button>
            )}
          </div>
        )}
      </div>

      {isDirectory && isExpanded && node.children && (
        <div className="tree-node-children">
          {node.children.map(child => (
            <TreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

const FileTree = () => {
  const { fileSystem } = useFileSystem();

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <h3>Explorer</h3>
      </div>
      <div className="file-tree-content">
        {fileSystem.children && fileSystem.children.map(child => (
          <TreeNode key={child.id} node={child} level={0} />
        ))}
      </div>
    </div>
  );
};

export default FileTree;
