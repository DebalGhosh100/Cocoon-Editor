# Cocoon Editor - Visual Usage Guide

## Getting Started

### What You'll See When You Open the Editor

```
┌─────────────────────────────────────────────────────────────────┐
│  Cocoon Editor                                     [Split View]  │
├─────────────┬───────────────────────────────────────────────────┤
│             │                                                     │
│  📁 root    │  📝 main.yaml                                      │
│  ├─ 📄 main │                                                     │
│  └─ 📁 stor │  blocks:                                           │
│     ├─ 📄 c │    - name: "Example Block"                         │
│     └─ 📄 s │      run: echo "Hello!"                            │
│             │                                                     │
│  File Tree  │           Editor Panel                             │
│             │                                                     │
└─────────────┴───────────────────────────────────────────────────┘
│                Clone Structure                                    │
└───────────────────────────────────────────────────────────────────┘
```

---

## Feature 1: Variable Autocomplete from Storage Files

### Step 1: Create a Storage File

In `storage/config.yaml`:
```yaml
app:
  name: "MyWorkflow"
  version: "1.0.0"

database:
  host: "localhost"
  port: 5432
```

### Step 2: Use in Main Workflow

In `main.yaml`, type:
```yaml
blocks:
  - run: echo "${
```

### Step 3: See the Magic! ✨

A popup appears with suggestions:

```
┌─────────────────────────────────────────────┐
│ ${config.app.name}                          │
│ Type: string                                │
│ Value: "MyWorkflow"                         │
├─────────────────────────────────────────────┤
│ ${config.app.version}                       │
│ Type: string                                │
│ Value: "1.0.0"                              │
├─────────────────────────────────────────────┤
│ ${config.database.host}                     │
│ Type: string                                │
│ Value: "localhost"                          │
├─────────────────────────────────────────────┤
│ ${config.database.port}                     │
│ Type: number                                │
│ Value: 5432                                 │
└─────────────────────────────────────────────┘
```

### Step 4: Select and Complete

Press `↓` to navigate, `Enter` to select:
```yaml
blocks:
  - run: echo "${config.app.name}"
                └─ Autocompleted!
```

---

## Feature 2: Linux Command Autocomplete

### In a `run:` Block

Type:
```yaml
blocks:
  - run: ls
         └─ Cursor here
```

See suggestions:
```
┌─────────────────────────────────────────────┐
│ ls                                          │
│ Linux command: ls                           │
├─────────────────────────────────────────────┤
│ ls -la                                      │
│ Linux command: ls -la                       │
├─────────────────────────────────────────────┤
│ ls -al                                      │
│ Linux command: ls -al                       │
├─────────────────────────────────────────────┤
│ ls -l                                       │
│ Linux command: ls -l                        │
└─────────────────────────────────────────────┘
```

---

## Feature 3: Framework Keywords

### Typing Framework Constructs

Type `par` anywhere:
```yaml
blocks:
  - par
    └─ Cursor here
```

See suggestion:
```
┌─────────────────────────────────────────────┐
│ parallel                                    │
│ Execute blocks in parallel                  │
│ Detail: Parallel execution                  │
└─────────────────────────────────────────────┘
```

Accept to get full template:
```yaml
blocks:
  - parallel:
      - name: ""
        run: 
```

---

## Feature 4: Nested Object Navigation

### Deep Configuration Access

Storage file `storage/config.yaml`:
```yaml
app:
  database:
    credentials:
      username: "admin"
      password: "secret"
```

Type `${config.database.`:
```
┌─────────────────────────────────────────────┐
│ ${config.database.credentials}              │
│ Type: object                                │
│ Value: {"username": "admin", ...}           │
├─────────────────────────────────────────────┤
│ ${config.database.credentials.username}     │
│ Type: string                                │
│ Value: "admin"                              │
├─────────────────────────────────────────────┤
│ ${config.database.credentials.password}     │
│ Type: string                                │
│ Value: "secret"                             │
└─────────────────────────────────────────────┘
```

---

## Feature 5: Split View Editing

### Editing Two Files Simultaneously

1. Click **[Split View]** button
2. Open `main.yaml` (left pane)
3. Click `storage/config.yaml` (opens in right pane)

```
┌──────────────┬─────────────┬──────────────┐
│ File Tree    │ main.yaml   │ config.yaml  │
├──────────────┼─────────────┼──────────────┤
│ 📁 root      │ blocks:     │ app:         │
│ ├─ 📄 main   │   - run:    │   name: "My" │
│ └─ 📁 storage│     echo "  │   version:   │
│    └─ 📄 conf│     ${confi │   "1.0.0"    │
│              │            ↑│    ↑          │
│              │     Type ${││ Edit value   │
│              │     here!  ││ See it live! │
└──────────────┴─────────────┴──────────────┘
```

**Real-Time Updates:**
- Edit `config.yaml` on the right
- Switch to `main.yaml` on the left
- Type `${` and see updated values immediately!

---

## Feature 6: Complete Workflow Example

### Visual Flow

```yaml
# Type this workflow and watch IntelliSense help you:

blocks:
  - name: "Setup Environment"
    run: |
      mkdir -p ${config.paths.logs}
                └─ Suggested: ${config.paths.logs}
      
      mkdir -p ${config.paths.data}
                └─ Suggested: ${config.paths.data}
  
  - parallel:
      └─ Suggested: full template appears
      
      - name: "Task 1"
        run: echo "Processing..."
             └─ Suggested: echo, ls, cat, etc.
      
      - name: "Task 2"
        run: python process.py
             └─ Suggested: python, pip, etc.
  
  - for:
      └─ Suggested: full loop template
      
      individual: server
      in: ${servers.production}
          └─ Suggested: ${servers.production}
      
      run: ssh ${server.ip}
               └─ Suggested: ssh, scp, rsync, etc.
                   └─ Suggested: ${server.ip}
```

---

## Visual Indicators

### IntelliSense Icons

| Icon | Meaning |
|------|---------|
| 📦 | Variable |
| ⚡ | Function/Command |
| 🔑 | Keyword |
| 📋 | Property |
| 📁 | Object |
| 📊 | Array |

### Suggestion Popup Structure

```
┌─────────────────────────────────────────────┐
│ 📦 ${config.app.name}          [Variable]   │← Label
│ ─────────────────────────────────────────── │
│ Type: string                                │← Type Info
│ Value: "MyWorkflow"                         │← Live Value
│                                             │
│ Full path: ${config.app.name}               │← Path
└─────────────────────────────────────────────┘
```

---

## Keyboard Shortcuts Visual

```
┌────────────────────────────────────────────┐
│  Press Ctrl+Space                          │
│       ↓                                    │
│  Manually trigger IntelliSense             │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  Type ${                                   │
│       ↓                                    │
│  Auto-trigger variable suggestions         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  ↑↓ arrows                                 │
│       ↓                                    │
│  Navigate suggestions                      │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  Tab or Enter                              │
│       ↓                                    │
│  Accept suggestion                         │
└────────────────────────────────────────────┘

┌────────────────────────────────────────────┐
│  Esc                                       │
│       ↓                                    │
│  Close suggestion popup                    │
└────────────────────────────────────────────┘
```

---

## Common Workflows - Visual Guide

### 1. Database Connection Workflow

```yaml
# storage/databases.yaml          # main.yaml
# ─────────────────────────       # ──────────────────────
postgres:                          blocks:
  host: "db.example.com"    →        - run: |
  port: 5432                ←          psql -h ${databases.postgres.host} \
  user: "admin"             ←               -p ${databases.postgres.port} \
  pass: "secret"            ←               -U ${databases.postgres.user}
                                      └─ All variables autocompleted!
```

### 2. Multi-Server Deployment

```yaml
# storage/servers.yaml            # main.yaml
# ─────────────────────────       # ──────────────────────
production:                        blocks:
  server1:                           - parallel:
    ip: "10.0.1.10"     ───┐             - run-remotely:
    user: "admin"       ───┼───→           ip: ${servers.production.server1.ip}
    pass: "deploy123"   ───┘               user: ${servers.production.server1.user}
  server2:                                 pass: ${servers.production.server1.pass}
    ip: "10.0.1.11"     ───┐               run: systemctl restart app
    user: "admin"       ───┼───→       
    pass: "deploy123"   ───┘         - run-remotely:
                                         ip: ${servers.production.server2.ip}
                                         user: ${servers.production.server2.user}
                                         pass: ${servers.production.server2.pass}
                                         run: systemctl restart app
```

---

## Tips for Visual Learning

### 🎯 Watch the Popup
```
Type: ${config.
          ↓
      [Popup appears with all nested keys]
          ↓
      Keep typing: app.
          ↓
      [Popup updates with app's keys]
          ↓
      Select: name
          ↓
      ${config.app.name} inserted!
```

### 🔄 Real-Time Feedback Loop
```
1. Edit storage/config.yaml    4. See NEW suggestions!
   Add: testing: true               including: ${config.testing}
        ↓                                    ↑
2. Save (auto-saves)            3. Type ${ in main.yaml
        ↓                                    ↑
   File parsed instantly ────────────────────┘
```

### 📚 Progressive Disclosure
```
Type:  $
       ↓ (no suggestions yet)
       
Type:  ${
       ↓ (ALL variables appear!)
       
Type:  ${config
       ↓ (filtered to config.* only)
       
Type:  ${config.app
       ↓ (filtered to config.app.* only)
```

---

## Color Guide

When you see suggestions:

- **Blue underline** → Autocomplete available
- **Red squiggle** → Syntax error (future feature)
- **Green highlight** → Valid variable reference (future feature)
- **Gray text** → Documentation/hint text

---

## Success Indicators

### ✅ It's Working When:
- Typing `${` shows a popup with variables
- Typing in `run:` shows Linux commands
- Typing `par` suggests `parallel`
- Documentation shows real values from storage files
- Changes in storage files appear in suggestions immediately

### ❌ Troubleshoot If:
- No popup appears → Press `Ctrl+Space`
- Wrong suggestions → Check file extension is `.yaml`
- Missing variables → Verify storage file has valid YAML syntax

---

**Visual learning works best - try it yourself! 🎨**
