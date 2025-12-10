import React, { useState, useRef, useEffect } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Plus, Trash2, Edit2, Check, X } from 'lucide-react';
import { useFileSystem } from '../context/FileSystemContext';
import './FileTree.css';

const TreeNode = ({ node, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const inputRef = useRef(null);
  const { selectedFile, selectFile, addNode, deleteNode, renameNode } = useFileSystem();

  const isSelected = selectedFile?.id === node.id;
  const isDirectory = node.type === 'directory';

  useEffect(() => {
    if (isRenaming && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isRenaming]);

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

  const handleRename = (e) => {
    e.stopPropagation();
    setIsRenaming(true);
    setNewName(node.name);
  };

  const handleRenameSubmit = (e) => {
    e.stopPropagation();
    if (newName.trim() && newName !== node.name) {
      renameNode(node.id, newName.trim());
    }
    setIsRenaming(false);
  };

  const handleRenameCancel = (e) => {
    e.stopPropagation();
    setNewName(node.name);
    setIsRenaming(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleRenameSubmit(e);
    } else if (e.key === 'Escape') {
      handleRenameCancel(e);
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
          {isRenaming ? (
            <div className="tree-node-rename" onClick={(e) => e.stopPropagation()}>
              <input
                ref={inputRef}
                type="text"
                className="rename-input"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleRenameSubmit}
              />
              <button
                className="rename-confirm-btn"
                onClick={handleRenameSubmit}
                title="Confirm"
              >
                <Check size={12} />
              </button>
              <button
                className="rename-cancel-btn"
                onClick={handleRenameCancel}
                title="Cancel"
              >
                <X size={12} />
              </button>
            </div>
          ) : (
            <span className="tree-node-name">{node.name}</span>
          )}
        </div>
        
        {showActions && !isRenaming && (
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
              <>
                <button
                  className="tree-action-btn"
                  onClick={handleRename}
                  title="Rename"
                >
                  <Edit2 size={14} />
                </button>
                <button
                  className="tree-action-btn delete"
                  onClick={handleDelete}
                  title="Delete"
                >
                  <Trash2 size={14} />
                </button>
              </>
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
