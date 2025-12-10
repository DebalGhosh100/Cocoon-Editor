# File Tree Editor

A React-based file tree viewer with an integrated YAML editor featuring IntelliSense and syntax highlighting. Built with a dark mode interface.

## Features

- **File/Directory Tree Viewer**: Navigate through a simulated file system on the left panel
- **Add/Delete Operations**: Create new files and folders, or delete existing ones
- **Resizable Panels**: Drag the divider to adjust panel widths
- **YAML Editor**: Monaco Editor integration with IntelliSense and syntax highlighting
- **Dark Mode**: Complete dark theme interface
- **Download Structure**: Export the entire file structure as JSON
- **Real-time Editing**: Changes are reflected immediately in the file tree

## Installation

1. Make sure you have Node.js and npm installed
2. Install dependencies:

```bash
npm install
```

## Running the Application

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Usage

### File Tree Operations
- **Click on a folder** to expand/collapse it
- **Click on a file** to open it in the editor
- **Hover over items** to see action buttons:
  - 📄+ Add File (directories only)
  - 📁+ Add Folder (directories only)
  - 🗑️ Delete item

### Editor Features
- **YAML Syntax Highlighting**: Full color coding for YAML files
- **IntelliSense**: Code suggestions and autocompletion
- **Line Numbers**: Easy navigation
- **Word Wrap**: Automatically wraps long lines
- **Bracket Matching**: Visual bracket pair colorization

### Download Structure
Click the "Download Structure" button in the editor header to export the entire file tree as a JSON file.

## Project Structure

```
src/
├── components/
│   ├── FileTree.jsx          # File tree component
│   ├── FileTree.css          # File tree styles
│   ├── CodeEditor.jsx        # Monaco editor wrapper
│   ├── CodeEditor.css        # Editor styles
│   ├── ResizablePanel.jsx    # Resizable panel layout
│   └── ResizablePanel.css    # Panel styles
├── context/
│   └── FileSystemContext.jsx # File system state management
├── App.jsx                   # Main app component
├── App.css                   # App styles
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## Technologies Used

- **React 18**: UI framework
- **Vite**: Build tool and dev server
- **Monaco Editor**: VS Code's editor (IntelliSense, syntax highlighting)
- **Lucide React**: Icon library
- **Context API**: State management

## Dark Mode

The application is designed exclusively in dark mode with a color scheme inspired by VS Code's dark theme:
- Background: `#1e1e1e`
- Panels: `#252526`
- Borders: `#2d2d30`
- Text: `#cccccc`
- Accent: `#007acc`
