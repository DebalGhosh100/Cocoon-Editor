# Cocoon Editor - IntelliSense Features

## Overview

The Cocoon Editor provides comprehensive IntelliSense support for the Cocoon/Blocks YAML workflow automation framework, making it a full-featured IDE for workflow development.

## Features

### 1. **Framework Keywords & Structure**

Auto-completion for all Cocoon framework keywords:

- **`blocks:`** - Root workflow container
- **`name:`** - Block identifier (optional)
- **`description:`** - Block documentation (optional)
- **`run:`** - Execute shell command(s) (required)
- **`parallel:`** - Execute blocks simultaneously
- **`for:`** - Loop iteration over lists
- **`run-remotely:`** - SSH remote execution
- **`individual:`** - Loop variable name
- **`in:`** - List source for loops
- **`ip:`**, **`user:`**, **`pass:`** - SSH credentials
- **`log-into:`** - Remote execution log file

### 2. **Linux Command Auto-completion**

When typing inside a `run:` block, get instant suggestions for 70+ common Linux commands:

**File Operations:**
- `ls`, `cd`, `pwd`, `mkdir`, `rm`, `cp`, `mv`, `cat`, `touch`

**Text Processing:**
- `grep`, `sed`, `awk`, `sort`, `uniq`, `wc`, `head`, `tail`

**System Operations:**
- `ps`, `top`, `kill`, `df`, `du`, `free`, `chmod`, `chown`

**Package Management:**
- `apt`, `apt-get`, `yum`, `dnf`, `pacman`

**Networking:**
- `wget`, `curl`, `ssh`, `scp`, `rsync`, `ping`, `netstat`, `ifconfig`

**Development:**
- `git`, `docker`, `npm`, `node`, `python`, `pip`, `make`, `gcc`

### 3. **Variable Interpolation from Storage Files** ⭐

The most powerful feature! Auto-complete variables from your `storage/` YAML files using the `${}` syntax.

#### How It Works

1. **Type `${`** in any field
2. **Get instant suggestions** for all variables from storage YAML files
3. **See live values and types** in the documentation popup

#### Example

If you have `storage/config.yaml`:
```yaml
app:
  name: "MyWorkflow"
  version: "1.0.0"

database:
  host: "localhost"
  port: 5432
  credentials:
    username: "admin"
```

When you type `${`, you'll see suggestions like:
- `${config.app.name}` → "MyWorkflow"
- `${config.app.version}` → "1.0.0"
- `${config.database.host}` → "localhost"
- `${config.database.port}` → 5432
- `${config.database.credentials.username}` → "admin"

### 4. **Nested Object Navigation**

The editor automatically parses nested YAML structures:

```yaml
# storage/servers.yaml
production:
  server1:
    ip: "10.0.1.10"
    user: "admin"
  server2:
    ip: "10.0.1.11"
    user: "admin"
```

Autocomplete provides:
- `${servers.production.server1.ip}`
- `${servers.production.server1.user}`
- `${servers.production.server2.ip}`
- `${servers.production.server2.user}`

### 5. **Real-time YAML Parsing**

The IntelliSense system:
- ✅ Parses all YAML files in the `storage/` directory
- ✅ Updates suggestions in real-time as you edit storage files
- ✅ Shows live values and types
- ✅ Handles nested objects and arrays
- ✅ Gracefully handles invalid YAML

## Usage Examples

### Basic Sequential Workflow
```yaml
blocks:
  - name: "Setup Environment"
    description: "Create necessary directories"
    run: mkdir -p ${config.paths.logs}
  
  - name: "Display Info"
    run: echo "Running ${config.app.name} v${config.app.version}"
```

### Parallel Execution
```yaml
blocks:
  - parallel:
      - name: "Task 1"
        run: echo "Processing data 1"
      - name: "Task 2"
        run: echo "Processing data 2"
```

### Loop Iteration
```yaml
blocks:
  - for:
      individual: server
      in: ${servers.production}
      run: echo "Deploying to ${server.ip}"
```

### SSH Remote Execution
```yaml
blocks:
  - name: "Deploy to Server"
    run-remotely:
      ip: ${servers.production.server1.ip}
      user: ${servers.production.server1.user}
      pass: ${servers.production.server1.pass}
      run: "systemctl restart myapp"
      log-into: "./logs/deploy.log"
```

## Tips for Maximum Productivity

1. **Organize Your Storage Files**
   - Keep related configs in separate files
   - Use descriptive filenames (config.yaml, servers.yaml, credentials.yaml)

2. **Use Nested Structures**
   - Group related values under parent keys
   - Makes autocomplete suggestions clearer

3. **Leverage the Documentation Popup**
   - Hover over suggestions to see current values
   - Verify variable paths before using them

4. **Test with Split View**
   - Open main.yaml on one side
   - Open storage/config.yaml on the other
   - See live updates as you modify configs

## Technical Details

### Storage File Discovery
- Automatically finds all `.yaml` files in the `storage/` directory
- Recursively parses nested objects
- Generates dot-notation paths (e.g., `config.app.name`)

### Variable Path Generation
- Filename becomes the root key (without `.yaml` extension)
- Nested keys joined with dots
- Wrapped in `${}` syntax for Cocoon framework

### IntelliSense Provider
- Uses Monaco Editor's `CompletionItemProvider` API
- Context-aware suggestions based on cursor position
- Triggered by `${` for variables, `run:` for commands

## Supported Cocoon Framework Features

✅ **Sequential Execution** - Run blocks in order  
✅ **Parallel Execution** - Run blocks simultaneously  
✅ **Variable Interpolation** - Use `${}` syntax  
✅ **Loop Iteration** - Iterate over lists/objects  
✅ **SSH Remote Execution** - Execute on remote servers  
✅ **Nested Loops** - Loops within loops  
✅ **Multi-line Commands** - Pipe operator support  
✅ **Configuration Management** - Separate logic from data  

## Future Enhancements

🔮 **Coming Soon:**
- YAML schema validation
- Error detection for invalid variable references
- Snippet library for common patterns
- Template workflows
- Syntax highlighting for variable interpolations
- Jump to definition for storage variables

---

**Happy Workflow Automation! 🚀**

For more information about the Cocoon framework, visit: https://github.com/DebalGhosh100/blocks
