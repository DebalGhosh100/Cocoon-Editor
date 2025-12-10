import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { useFileSystem } from '../context/FileSystemContext';
import './CodeEditor.css';

const CodeEditor = () => {
  const { selectedFile, updateNodeContent } = useFileSystem();
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;

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

    // Register autocomplete provider for YAML
    monaco.languages.registerCompletionItemProvider('yaml', {
      provideCompletionItems: (model, position) => {
        const lineContent = model.getLineContent(position.lineNumber);
        const textUntilPosition = lineContent.substring(0, position.column - 1);
        
        // Check if we're inside a 'run:' block
        const runMatch = textUntilPosition.match(/run:\s*['"]?([^'"]*$)/);
        
        if (runMatch) {
          const word = model.getWordUntilPosition(position);
          const range = {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: word.startColumn,
            endColumn: word.endColumn
          };

          const suggestions = linuxCommands.map(cmd => ({
            label: cmd,
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: `Linux command: ${cmd}`,
            insertText: cmd,
            range: range
          }));

          return { suggestions };
        }

        return { suggestions: [] };
      }
    });
  };

  const handleEditorChange = (value) => {
    if (selectedFile) {
      updateNodeContent(selectedFile.id, value);
    }
  };

  return (
    <div className="code-editor">
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
            onChange={handleEditorChange}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
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
        )}
      </div>
    </div>
  );
};

export default CodeEditor;
