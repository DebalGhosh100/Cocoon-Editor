# Cocoon Editor

A full-featured IDE for the Cocoon/Blocks YAML workflow automation framework. Built with React and Monaco Editor, featuring intelligent auto-completion, variable interpolation, and a dark mode interface.

> 🎯 **Purpose**: Create and edit Cocoon workflows with intelligent IntelliSense that understands your storage configurations and suggests variables dynamically.

## Features

### 🌲 File System Management
- **File/Directory Tree Viewer**: Navigate through your workflow structure
- **Add/Delete/Rename Operations**: Full CRUD operations on files and folders
- **Split View**: Edit two files side-by-side
- **Resizable Panels**: Drag the divider to adjust panel widths
- **Clone Structure**: Generate Linux commands to recreate your file structure

### 🧠 Intelligent IntelliSense
- **Cocoon Framework Keywords**: Auto-complete for `blocks`, `parallel`, `for`, `run-remotely`, etc.
- **Linux Command Suggestions**: 70+ common commands when typing in `run:` blocks
- **Dynamic Variable Interpolation**: Auto-complete variables from `storage/` YAML files using `${}` syntax
- **Live Value Preview**: See actual values and types from your config files
- **Nested Object Navigation**: Intelligent parsing of complex YAML structures

### ✨ Editor Features
- **Monaco Editor**: VS Code's powerful editor engine
- **YAML Syntax Highlighting**: Full color coding and validation
- **Real-time Parsing**: Storage files are parsed live for autocomplete
- **Dark Mode**: Complete dark theme interface optimized for long coding sessions
- **Line Numbers & Bracket Matching**: Professional code editing experience

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

### IntelliSense Features

**Framework Keywords**: Type to get suggestions for Cocoon syntax
```yaml
blocks:     # Auto-suggested
  - name:   # Auto-suggested
    run:    # Auto-suggested
```

**Linux Commands**: Get command suggestions in `run:` blocks
```yaml
run: ls -la  # 'ls' suggested with all common flags
```

**Variable Interpolation** (⭐ Key Feature): Type `${` to see all variables from storage files
```yaml
# In storage/config.yaml:
app:
  name: "MyWorkflow"

# In main.yaml:
run: echo "${config.app.name}"  # Auto-suggested with live value!
```

**[📖 Full IntelliSense Documentation](./INTELLISENSE.md)**

### Clone Structure
Click the "Clone Structure" button to get Linux commands that recreate your entire workflow structure.

## Quick Start

1. **Select or create `main.yaml`** - Your main workflow file
2. **Add storage files** - Create YAML configs in the `storage/` directory
3. **Type `${` in main.yaml** - See auto-suggestions from your storage files!
4. **Use framework keywords** - Type `blocks`, `parallel`, `for`, etc.
5. **Get Linux commands** - Type in `run:` blocks for command suggestions

## Example Workflow

Create a file structure like this:

```
my-workflow/
├── main.yaml
└── storage/
    ├── config.yaml
    └── servers.yaml
```

**storage/config.yaml:**
```yaml
app:
  name: "DeployBot"
  version: "2.0.0"
```

**main.yaml:**
```yaml
blocks:
  - name: "Deploy Application"
    run: echo "Deploying ${config.app.name} v${config.app.version}"
    # Type ${ and see suggestions: config.app.name, config.app.version, etc.
```

## Project Structure

```
src/
├── components/
│   ├── FileTree.jsx          # File tree with rename/add/delete
│   ├── FileTree.css          # File tree styles
│   ├── EditorPanel.jsx       # Monaco editor with IntelliSense
│   ├── EditorPanel.css       # Editor styles
│   ├── ResizablePanel.jsx    # Resizable panel layout
│   └── ResizablePanel.css    # Panel styles
├── context/
│   └── FileSystemContext.jsx # File system state management
├── App.jsx                   # Main app with Clone Structure popup
├── App.css                   # App styles
├── main.jsx                  # Entry point
└── index.css                 # Global styles
```

## Technologies Used

- **React 18**: UI framework with hooks
- **Vite**: Lightning-fast build tool and dev server
- **Monaco Editor**: VS Code's powerful editor engine with IntelliSense
- **js-yaml**: YAML parsing for storage file analysis
- **Lucide React**: Modern icon library
- **Context API**: Centralized state management

## Cocoon Framework Support

This editor is specifically designed for the [Cocoon/Blocks workflow automation framework](https://github.com/DebalGhosh100/blocks).

**Supported Features:**
- ✅ Sequential execution (`blocks`)
- ✅ Parallel execution (`parallel`)
- ✅ Variable interpolation (`${}`)
- ✅ Loop iteration (`for`)
- ✅ SSH remote execution (`run-remotely`)
- ✅ Configuration management (`storage/` directory)
- ✅ Multi-line commands
- ✅ Nested loops

## Dark Mode

The application is designed exclusively in dark mode with a color scheme inspired by VS Code's dark theme:
- Background: `#1e1e1e`
- Panels: `#252526`
- Borders: `#2d2d30`
- Text: `#cccccc`
- Accent: `#007acc`
