# Cocoon Editor - Testing Guide

## How to Test the New IntelliSense Features

### 1. Test Framework Keywords

**Steps:**
1. Open `main.yaml` in the editor
2. Start typing on a new line
3. Type `par` and wait for suggestions
4. You should see: `parallel`
5. Press Tab or Enter to accept

**Expected keywords:**
- `blocks`
- `name`
- `description`
- `run`
- `parallel`
- `for`
- `run-remotely`
- `individual`
- `in`
- `ip`, `user`, `pass`
- `log-into`

### 2. Test Linux Command Auto-completion

**Steps:**
1. Open `main.yaml`
2. Type: `run: `
3. Start typing common commands
4. Try: `ls`, `echo`, `git`, `docker`, `npm`

**Test cases:**
```yaml
blocks:
  - run: ls     # Should suggest: ls, ls -la, ls -al, ls -l
  - run: ec     # Should suggest: echo
  - run: mk     # Should suggest: mkdir
  - run: gi     # Should suggest: git
```

### 3. Test Variable Interpolation (Main Feature!)

**Steps:**
1. Open `main.yaml`
2. Type: `run: echo "${`
3. Observe the suggestions popup

**Expected suggestions from storage/config.yaml:**
- `${config.app.name}` → "MyWorkflow"
- `${config.app.version}` → "1.0.0"
- `${config.app.environment}` → "production"
- `${config.database.host}` → "localhost"
- `${config.database.port}` → 5432
- `${config.database.credentials.username}` → "admin"
- `${config.paths.logs}` → "./logs"
- `${config.servers.web.ip}` → "192.168.1.10"

**Expected suggestions from storage/servers.yaml:**
- `${servers.production.server1.ip}` → "10.0.1.10"
- `${servers.production.server1.user}` → "admin"
- `${servers.staging.server1.ip}` → "10.0.2.10"

### 4. Test Real-time Updates

**Steps:**
1. Open split view (click "Split View" button)
2. Open `main.yaml` on the left
3. Open `storage/config.yaml` on the right
4. In `config.yaml`, add a new property:
   ```yaml
   app:
     name: "MyWorkflow"
     version: "1.0.0"
     newProperty: "test123"  # Add this
   ```
5. Switch to `main.yaml`
6. Type `${` and look for suggestions
7. You should now see `${config.app.newProperty}` with value "test123"

### 5. Test Nested Object Navigation

**Steps:**
1. Open `main.yaml`
2. Type: `run: echo "${config.database.credentials.`
3. As you type each level, verify suggestions appear:
   - After `${`: Shows all top-level (config, servers)
   - After `${config.`: Shows all keys under config (app, database, paths, servers)
   - After `${config.database.`: Shows (host, port, name, credentials)
   - After `${config.database.credentials.`: Shows (username, password)

### 6. Test Complex Workflow Example

Create this in `main.yaml`:

```yaml
blocks:
  - name: "Setup Directories"
    description: "Create necessary directories"
    run: |
      mkdir -p ${config.paths.logs}
      mkdir -p ${config.paths.data}
  
  - name: "Display Configuration"
    run: |
      echo "App: ${config.app.name}"
      echo "Version: ${config.app.version}"
      echo "Environment: ${config.app.environment}"
  
  - parallel:
      - name: "Check Server 1"
        run: ping -c 1 ${config.servers.web.ip}
      
      - name: "Check Server 2"
        run: ping -c 1 ${config.servers.api.ip}
  
  - for:
      individual: server
      in: ${servers.production}
      run: echo "Server IP: ${server.ip}, User: ${server.user}"
```

**Verify:**
- All `${}` variables show suggestions
- Framework keywords (`blocks`, `parallel`, `for`) were suggested
- Linux commands (`mkdir`, `echo`, `ping`) were suggested in `run:` blocks

### 7. Test Error Handling

**Steps:**
1. Create invalid YAML in `storage/config.yaml`:
   ```yaml
   app:
     name: "Test
   # Missing closing quote - invalid YAML
   ```
2. Switch to `main.yaml`
3. Type `${`
4. Editor should gracefully skip the invalid file and not crash

### 8. Test with Empty Storage Files

**Steps:**
1. Open `storage/config.yaml`
2. Delete all content (leave it empty)
3. Switch to `main.yaml`
4. Type `${`
5. Should only show suggestions from `servers.yaml` (config.yaml skipped)

### 9. Test Documentation Popup

**Steps:**
1. Open `main.yaml`
2. Type `${con`
3. When suggestion `${config.app.name}` appears, hover over it
4. Documentation should show:
   - Type: string
   - Value: "MyWorkflow"

### 10. Test SSH Remote Execution Template

**Steps:**
1. Type `run-remotely:` in `main.yaml`
2. Accept the suggestion
3. Verify it inserts the full template:
   ```yaml
   run-remotely:
     ip: 
     user: 
     pass: 
     run: 
     log-into: 
   ```

## Common Issues and Solutions

### Issue: No suggestions appearing
**Solution:** 
- Make sure you're typing in a YAML file
- Check that the editor has focus
- Try Ctrl+Space to manually trigger suggestions

### Issue: Variables not showing from storage files
**Solution:**
- Verify files are in `storage/` directory
- Check YAML syntax is valid
- Make sure filenames end with `.yaml`
- Try editing the storage file to trigger re-parse

### Issue: Suggestions appearing in wrong context
**Solution:**
- This is expected - Monaco provides context-aware suggestions
- Variables only show after `${`
- Linux commands only show in `run:` blocks
- Keywords show everywhere

## Performance Notes

- Storage files are parsed on every keystroke in `main.yaml`
- For large storage files (>1000 lines), there may be slight lag
- This is acceptable for typical workflow configurations
- Future optimization: cache parsed results and only re-parse on storage file changes

## Success Criteria

✅ All framework keywords appear in suggestions  
✅ Linux commands appear in `run:` blocks  
✅ Variables from storage files appear after `${`  
✅ Documentation shows correct values and types  
✅ Real-time updates work when editing storage files  
✅ Nested object navigation works correctly  
✅ Invalid YAML is handled gracefully  
✅ Split view allows simultaneous editing  
✅ No crashes or console errors  

---

**If all tests pass, the Cocoon Editor is ready for production use! 🎉**
