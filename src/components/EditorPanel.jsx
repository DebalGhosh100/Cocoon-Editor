import React, { useRef, useEffect, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useFileSystem } from '../context/FileSystemContext';
import { Columns } from 'lucide-react';
import './EditorPanel.css';
import yaml from 'js-yaml';

const EditorPanel = () => {
  const { selectedFile, selectedFile2, splitView, updateNodeContent, toggleSplitView, fileSystem, setActiveEditor } = useFileSystem();
  const editorRef1 = useRef(null);
  const editorRef2 = useRef(null);
  const [leftPaneWidth, setLeftPaneWidth] = useState(50); // percentage
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);

  // Parse all YAML files in storage directory to build autocomplete suggestions
  // This function is called on every keystroke, so it automatically picks up newly created files
  const getStorageYamlStructure = () => {
    const storageFiles = {};
    
    const traverseFileSystem = (node, parentPath = '') => {
      // Check if this is a storage directory
      if (node.type === 'directory' && node.name === 'storage') {
        // Process all YAML files in this storage directory
        if (node.children) {
          node.children.forEach(child => {
            if (child.type === 'file' && child.name.endsWith('.yaml')) {
              try {
                // Parse the YAML content
                const parsed = yaml.load(child.content || '');
                const filename = child.name.replace('.yaml', '');
                
                // Only add if parsing was successful and resulted in an object
                if (parsed && typeof parsed === 'object') {
                  storageFiles[filename] = parsed;
                }
              } catch (e) {
                // Invalid YAML, skip silently
                console.debug(`Skipping invalid YAML file: ${child.name}`, e.message);
              }
            }
          });
        }
      }
      
      // Continue traversing to find storage directories at any level
      if (node.children) {
        node.children.forEach(child => traverseFileSystem(child, `${parentPath}/${node.name}`));
      }
    };
    
    traverseFileSystem(fileSystem);
    return storageFiles;
  };

  // Generate variable path suggestions from storage YAML structure
  const generateVariableSuggestions = (storageFiles) => {
    const suggestions = [];
    
    const traverse = (obj, path, filename) => {
      if (typeof obj === 'object' && obj !== null && !Array.isArray(obj)) {
        // Handle objects - generate suggestions for each key
        Object.keys(obj).forEach(key => {
          const fullPath = path ? `${path}.${key}` : key;
          const displayPath = `\${${filename}.${fullPath}}`;
          const value = obj[key];
          
          // Add suggestion for this path
          suggestions.push({
            path: displayPath,
            value: value,
            type: Array.isArray(value) ? 'array' : typeof value
          });
          
          // Recursively traverse nested objects
          if (typeof value === 'object' && value !== null) {
            traverse(value, fullPath, filename);
          }
        });
      } else if (Array.isArray(obj)) {
        // Handle arrays - add the array itself as a suggestion
        const displayPath = path ? `\${${filename}.${path}}` : `\${${filename}}`;
        suggestions.push({
          path: displayPath,
          value: obj,
          type: 'array'
        });
        
        // Also traverse array elements if they are objects
        obj.forEach((item, index) => {
          if (typeof item === 'object' && item !== null) {
            const arrayPath = path ? `${path}[${index}]` : `[${index}]`;
            traverse(item, arrayPath, filename);
          }
        });
      }
    };
    
    // Process each storage file
    Object.keys(storageFiles).forEach(filename => {
      const content = storageFiles[filename];
      if (content && typeof content === 'object') {
        traverse(content, '', filename);
      }
    });
    
    return suggestions;
  };

  const handleEditorDidMount = (editor, monaco) => {
    // Configure YAML language support
    monaco.languages.yaml?.yamlDefaults?.setDiagnosticsOptions({
      validate: true,
      schemas: [],
    });

    // Common Linux commands for autocomplete
    const linuxCommands = [
      'ls', 'ls -al', 'ls -la', 'ls -l', 'cd', 'pwd', 'mkdir', 'rmdir', 'rm', 'cp', 'mv', 
      'cat ', 'cat', 'echo',
      'grep', 'find', 'sed', 'awk', 'sort', 'uniq', 'wc', 'head', 'tail ', 'tail',
      'chmod', 'chown', 'chgrp', 'touch', 'tar', 'zip', 'unzip', 'gzip', 'gunzip',
      'ps', 'top', 'kill', 'killall', 'bg', 'fg', 'jobs', 'df', 'du', 'free',
      'which', 'whereis', 'wget', 'curl', 'ssh', 'scp', 'rsync', 'ping', 'netstat',
      'ifconfig', 'ip', 'hostname', 'uptime', 'whoami', 'sudo', 'sudo apt-get ', 'su', 
      'apt', 'apt-get ', 'yum ', 'dnf', 'pacman', 'systemctl', 'service', 'journalctl', 'dmesg',
      'export', 'env', 'printenv', 'source', 'alias', 'history', 'man', 'help',
      'git', 'docker', 'npm', 'node', 'python', 'pip', 'java', 'javac', 'gcc',
      'make', 'cmake', 'vim', 'nano', 'emacs', 'code', 'less', 'more'
    ];

    // Cocoon framework keywords and snippets
    const cocoonKeywords = [
      {
        label: 'blocks',
        kind: monaco.languages.CompletionItemKind.Keyword,
        documentation: 'Root element for Cocoon workflow',
        insertText: 'blocks:\n  - ',
        detail: 'Workflow container'
      },
      {
        label: 'name',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'Block name (optional)',
        insertText: 'name: ""',
        detail: 'Block identifier'
      },
      {
        label: 'description',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'Block description (optional)',
        insertText: 'description: ""',
        detail: 'Block documentation'
      },
      {
        label: 'run',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'Shell command(s) to execute',
        insertText: 'run: ',
        detail: 'Execute command'
      },
      {
        label: 'parallel',
        kind: monaco.languages.CompletionItemKind.Keyword,
        documentation: 'Execute blocks in parallel',
        insertText: 'parallel:\n  - name: ""\n    run: ',
        detail: 'Parallel execution'
      },
      {
        label: 'for',
        kind: monaco.languages.CompletionItemKind.Keyword,
        documentation: 'Loop iteration over list',
        insertText: 'for:\n  individual: item\n  in: ${}\n  run: ',
        detail: 'Loop comprehension'
      },
      {
        label: 'run-remotely',
        kind: monaco.languages.CompletionItemKind.Keyword,
        documentation: 'Execute command on remote server via SSH',
        insertText: 'run-remotely:\n  ip: \n  user: \n  pass: \n  run: \n  log-into: ',
        detail: 'SSH remote execution'
      },
      {
        label: 'individual',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'Loop variable name',
        insertText: 'individual: ',
        detail: 'For loop variable'
      },
      {
        label: 'in',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'List to iterate over',
        insertText: 'in: ${}',
        detail: 'Loop source'
      },
      {
        label: 'ip',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'Remote server IP address',
        insertText: 'ip: ',
        detail: 'SSH host'
      },
      {
        label: 'user',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'SSH username',
        insertText: 'user: ',
        detail: 'SSH authentication'
      },
      {
        label: 'pass',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'SSH password',
        insertText: 'pass: ',
        detail: 'SSH authentication'
      },
      {
        label: 'log-into',
        kind: monaco.languages.CompletionItemKind.Property,
        documentation: 'Log file path for remote execution output',
        insertText: 'log-into: ',
        detail: 'Remote execution logging'
      }
    ];

    // Register autocomplete provider for YAML
    monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilPosition = lineContent.substring(0, position.column - 1);
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        // Check for ${} variable syntax
        const variableMatch = textUntilPosition.match(/\$\{([^}]*$)/);
        if (variableMatch) {
          // Parse storage files dynamically - this runs on every keystroke
          // so newly created YAML files in the storage directory are automatically detected
          const storageFiles = getStorageYamlStructure();
          const variableSuggestions = generateVariableSuggestions(storageFiles);
          
          const suggestions = variableSuggestions.map(varSug => ({
            label: varSug.path,
            kind: monaco.languages.CompletionItemKind.Variable,
            documentation: `Type: ${varSug.type}\nValue: ${JSON.stringify(varSug.value, null, 2)}`,
            insertText: varSug.path.replace('${', '').replace('}', ''),
            detail: `${varSug.type}`,
            range: range,
            sortText: `0_${varSug.path}` // Prioritize storage variables
          }));

          return { suggestions };
        }
        
        // Check if we're inside a 'run:' block for Linux commands
        const runMatch = textUntilPosition.match(/run:\s*['"]?([^'"]*$)/);
        if (runMatch) {
          const suggestions = linuxCommands.map(cmd => ({
            label: cmd,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: `Linux command: ${cmd}`,
            insertText: cmd,
            range: range
          }));

          return { suggestions };
        }

        // Default: provide Cocoon framework keywords
        const suggestions = cocoonKeywords.map(keyword => ({
          ...keyword,
          range: range
        }));

        return { suggestions };
      }
    });
  };

  const handleEditorChange1 = (value) => {
    if (selectedFile) {
      updateNodeContent(selectedFile.id, value);
    }
  };

  const handleEditorChange2 = (value) => {
    if (selectedFile2) {
      updateNodeContent(selectedFile2.id, value);
    }
  };

  // Handle split pane resize
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging || !containerRef.current) return;

      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      const newLeftWidth = ((e.clientX - rect.left) / rect.width) * 100;

      // Constrain between 20% and 80%
      if (newLeftWidth >= 20 && newLeftWidth <= 80) {
        setLeftPaneWidth(newLeftWidth);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const EmptyState = () => (
    <div className="editor-empty-state">
      <div className="empty-state-content">
        <svg
          width="64"
          height="64"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
          <polyline points="13 2 13 9 20 9" />
        </svg>
        <p>Select a file to start editing</p>
      </div>
    </div>
  );

  return (
    <div className="editor-panel">
      <div className="editor-toolbar">
        <button
          className={`split-view-btn ${splitView ? 'active' : ''}`}
          onClick={toggleSplitView}
          title={splitView ? 'Close split view' : 'Open split view'}
        >
          <Columns size={16} />
          <span>{splitView ? 'Single View' : 'Split View'}</span>
        </button>
      </div>

      <div className={`editor-container ${splitView ? 'split' : ''}`} ref={containerRef}>
        <div className="editor-pane" style={splitView ? { width: `${leftPaneWidth}%` } : {}}>
          <div className="editor-header">
            <div className="editor-title">
              {selectedFile ? (
                <span className="editor-filename">{selectedFile.name}</span>
              ) : (
                <span className="editor-placeholder">No file selected</span>
              )}
            </div>
          </div>
          <div className="editor-content">
            {selectedFile ? (
              <Editor
                height="100%"
                language="yaml"
                theme="vs-dark"
                value={selectedFile.content}
                onChange={handleEditorChange1}
                onMount={(editor, monaco) => {
                  editorRef1.current = editor;
                  handleEditorDidMount(editor, monaco);
                  editor.onDidFocusEditorText(() => setActiveEditor(1));
                }}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'off',
                  lineNumbers: 'on',
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  tabSize: 2,
                  insertSpaces: true,
                  folding: true,
                  renderWhitespace: 'selection',
                  bracketPairColorization: {
                    enabled: true
                  },
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                  },
                  quickSuggestions: {
                    other: true,
                    comments: false,
                    strings: true
                  },
                  parameterHints: {
                    enabled: true
                  },
                }}
              />
            ) : (
              <EmptyState />
            )}
          </div>
        </div>

        {splitView && (
          <>
            <div className="editor-divider" onMouseDown={handleMouseDown} />
            <div className="editor-pane" style={{ width: `${100 - leftPaneWidth}%` }}>
              <div className="editor-header">
                <div className="editor-title">
                  {selectedFile2 ? (
                    <span className="editor-filename">{selectedFile2.name}</span>
                  ) : (
                    <span className="editor-placeholder">Select another file</span>
                  )}
                </div>
              </div>
              <div className="editor-content">
                {selectedFile2 ? (
                  <Editor
                    height="100%"
                    language="yaml"
                    theme="vs-dark"
                    value={selectedFile2.content}
                    onChange={handleEditorChange2}
                    onMount={(editor, monaco) => {
                      editorRef2.current = editor;
                      handleEditorDidMount(editor, monaco);
                      editor.onDidFocusEditorText(() => setActiveEditor(2));
                    }}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 14,
                      wordWrap: 'off',
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      automaticLayout: true,
                      tabSize: 2,
                      insertSpaces: true,
                      folding: true,
                      renderWhitespace: 'selection',
                      bracketPairColorization: {
                        enabled: true
                      },
                      suggest: {
                        showKeywords: true,
                        showSnippets: true,
                      },
                      quickSuggestions: {
                        other: true,
                        comments: false,
                        strings: true
                      },
                      parameterHints: {
                        enabled: true
                      },
                    }}
                  />
                ) : (
                  <EmptyState />
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
