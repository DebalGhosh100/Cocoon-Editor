# Cocoon Editor - Quick Reference

## 🚀 Quick Start

1. **Open main.yaml** (already selected by default)
2. **Type `${`** to see all variables from storage files
3. **Type in `run:` blocks** to get Linux command suggestions
4. **Type anywhere** to get Cocoon framework keywords

---

## 🎯 IntelliSense Triggers

| You Type | You Get |
|----------|---------|
| `${` | Variables from storage/*.yaml files |
| `run: ` | Linux commands (ls, cd, git, docker, etc.) |
| `par` | `parallel` keyword |
| `blo` | `blocks` keyword |
| `for` | Loop iteration template |
| `run-remotely` | SSH execution template |

---

## 📝 Variable Syntax

```yaml
# Storage file: storage/config.yaml
app:
  name: "MyApp"
  version: "1.0.0"

# In main.yaml:
run: echo "${config.app.name}"  # ← Type ${ to autocomplete
```

**Format:** `${filename.key1.key2.key3}`

---

## 🔑 Framework Keywords

### Sequential Block
```yaml
blocks:
  - name: "My Task"
    description: "What this does"
    run: command
```

### Parallel Execution
```yaml
blocks:
  - parallel:
      - name: "Task 1"
        run: command1
      - name: "Task 2"
        run: command2
```

### Loop Iteration
```yaml
blocks:
  - for:
      individual: item
      in: ${config.list}
      run: echo "${item}"
```

### SSH Remote Execution
```yaml
blocks:
  - run-remotely:
      ip: ${server.ip}
      user: ${server.user}
      pass: ${server.pass}
      run: systemctl restart app
      log-into: ./logs/deploy.log
```

---

## 🗂️ File Structure

```
my-workflow/
├── main.yaml              # Main workflow
└── storage/               # Configuration files
    ├── config.yaml        # App configs
    └── servers.yaml       # Server details
```

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Trigger IntelliSense | `Ctrl+Space` |
| Accept suggestion | `Tab` or `Enter` |
| Multi-line edit | `Ctrl+Alt+↓` |
| Format document | `Shift+Alt+F` |
| Find | `Ctrl+F` |
| Replace | `Ctrl+H` |
| Go to line | `Ctrl+G` |
| Comment line | `Ctrl+/` |

---

## 💡 Pro Tips

### 1. Use Split View
- Click "Split View" button
- Edit main.yaml and storage/config.yaml simultaneously
- See live updates as you change configs

### 2. Organize Storage Files
```
storage/
├── config.yaml      # App settings
├── servers.yaml     # Server credentials
├── databases.yaml   # DB connections
└── paths.yaml       # File paths
```

### 3. Leverage Nested Objects
```yaml
# Good: Organized hierarchy
servers:
  production:
    web1:
      ip: "10.0.1.10"
      user: "admin"

# Access: ${servers.production.web1.ip}
```

### 4. Check Documentation Popups
- Hover over suggestions to see:
  - Current value
  - Data type
  - Full variable path

### 5. Use Multi-line Commands
```yaml
run: |
  echo "Starting..."
  npm install
  npm run build
  echo "Done!"
```

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| No suggestions | Press `Ctrl+Space` manually |
| Variables not showing | Check YAML syntax in storage files |
| Wrong suggestions | Context matters - variables only show after `${` |
| Slow IntelliSense | Large storage files may cause lag |

---

## 📚 Documentation

- **Full IntelliSense Guide**: [INTELLISENSE.md](./INTELLISENSE.md)
- **Testing Guide**: [TESTING.md](./TESTING.md)
- **Workflow Examples**: [EXAMPLES.md](./EXAMPLES.md)
- **Implementation Details**: [IMPLEMENTATION.md](./IMPLEMENTATION.md)

---

## 🔗 Related Links

- **Cocoon Framework**: https://github.com/DebalGhosh100/blocks
- **Live Editor**: https://debalghosh100.github.io/Cocoon-Editor/
- **Monaco Editor Docs**: https://microsoft.github.io/monaco-editor/

---

## ✨ Feature Highlights

✅ **70+ Linux commands** auto-suggested  
✅ **All Cocoon keywords** supported  
✅ **Real-time variable parsing** from storage  
✅ **Nested object navigation** (unlimited depth)  
✅ **Live value previews** in popups  
✅ **Context-aware suggestions**  
✅ **Split view editing**  
✅ **Dark mode optimized**  

---

**Happy Workflow Building! 🎉**
