# Testing Dynamic YAML File Detection

## How to Verify the Enhancement Works

### Test 1: Create a New Storage File and Verify Auto-Detection

1. **Open the Cocoon Editor** at http://localhost:5174/Cocoon-Editor/

2. **In the file tree, hover over the `storage` folder** and click the "📄+ Add File" button

3. **Name the new file** `testing.yaml` (or any name ending in `.yaml`)

4. **Add some content to the new file:**
   ```yaml
   feature:
     name: "Dynamic Detection"
     enabled: true
     version: "1.0.0"
   
   settings:
     timeout: 30
     retries: 3
     debug: false
   ```

5. **Save the file** (it auto-saves)

6. **Switch to `main.yaml`** in the left panel

7. **Type `${` in the editor**

8. **Verify you see new suggestions:**
   - `${testing.feature.name}` → "Dynamic Detection"
   - `${testing.feature.enabled}` → true
   - `${testing.feature.version}` → "1.0.0"
   - `${testing.settings.timeout}` → 30
   - `${testing.settings.retries}` → 3
   - `${testing.settings.debug}` → false

✅ **Success!** If you see these suggestions, the dynamic detection is working!

---

### Test 2: Modify an Existing Storage File

1. **Open `storage/config.yaml`**

2. **Add a new section:**
   ```yaml
   # Add this to the existing content
   newFeature:
     experimental: true
     description: "Testing real-time updates"
   ```

3. **Switch back to `main.yaml`**

4. **Type `${config.new`**

5. **Verify you see:**
   - `${config.newFeature.experimental}` → true
   - `${config.newFeature.description}` → "Testing real-time updates"

✅ **Success!** The editor picks up changes immediately!

---

### Test 3: Create Multiple New Storage Files

1. **Add another file:** `storage/database.yaml`
   ```yaml
   connections:
     primary:
       host: "db1.example.com"
       port: 5432
     secondary:
       host: "db2.example.com"
       port: 5432
   ```

2. **Add another file:** `storage/api.yaml`
   ```yaml
   endpoints:
     users: "/api/v1/users"
     posts: "/api/v1/posts"
   
   auth:
     token: "secret123"
   ```

3. **Switch to `main.yaml`**

4. **Type `${` and verify ALL files are detected:**
   - `${config.*}` - From config.yaml
   - `${servers.*}` - From servers.yaml
   - `${testing.*}` - From testing.yaml (newly created)
   - `${database.*}` - From database.yaml (newly created)
   - `${api.*}` - From api.yaml (newly created)

✅ **Success!** All storage files are detected, including newly created ones!

---

### Test 4: Nested Objects and Arrays

1. **Create `storage/complex.yaml`:**
   ```yaml
   users:
     - name: "Alice"
       role: "admin"
       active: true
     - name: "Bob"
       role: "user"
       active: true
   
   nested:
     level1:
       level2:
         level3:
           deepValue: "Found me!"
   ```

2. **Switch to `main.yaml`**

3. **Type `${complex.nested.level1.level2.level3.`**

4. **Verify you see:**
   - `${complex.nested.level1.level2.level3.deepValue}` → "Found me!"

5. **Also verify array handling:**
   - `${complex.users}` → Shows the array
   - `${complex.users[0].name}` → "Alice"
   - `${complex.users[1].name}` → "Bob"

✅ **Success!** Deep nesting and arrays work perfectly!

---

### Test 5: Invalid YAML Handling

1. **Create `storage/broken.yaml`:**
   ```yaml
   invalid:
     - name: "Test
     missing: quote
   # This is invalid YAML
   ```

2. **Switch to `main.yaml`**

3. **Type `${`**

4. **Verify:**
   - Other valid storage files still show suggestions
   - The broken file is silently skipped
   - No errors or crashes

5. **Check browser console (F12):**
   - Should see: `Skipping invalid YAML file: broken.yaml`

✅ **Success!** Invalid YAML files don't break the editor!

---

### Test 6: Rename a Storage File

1. **Right-click on `storage/testing.yaml`**

2. **Click the Edit button (pencil icon)**

3. **Rename it to `features.yaml`**

4. **Switch to `main.yaml`**

5. **Type `${`**

6. **Verify:**
   - Old `${testing.*}` suggestions are gone
   - New `${features.*}` suggestions appear

✅ **Success!** File renames are detected immediately!

---

### Test 7: Delete a Storage File

1. **Hover over `storage/broken.yaml`**

2. **Click the Delete button (🗑️)**

3. **Switch to `main.yaml`**

4. **Type `${`**

5. **Verify:**
   - `${broken.*}` suggestions are gone
   - Other storage files still work

✅ **Success!** Deletions are handled correctly!

---

### Test 8: Split View Testing

1. **Click "Split View" button**

2. **Open `main.yaml` on the left**

3. **Open `storage/config.yaml` on the right**

4. **In the right pane, add:**
   ```yaml
   liveTest:
     message: "This updates live!"
   ```

5. **In the left pane (main.yaml), type `${config.live`**

6. **Verify you see:**
   - `${config.liveTest.message}` → "This updates live!"

✅ **Success!** Split view with live updates works!

---

## Technical Details

### How It Works

1. **On Every Keystroke:** When you type in the editor, Monaco calls `provideCompletionItems()`

2. **Dynamic Parsing:** The `getStorageYamlStructure()` function:
   - Traverses the entire file system tree
   - Finds all directories named "storage"
   - Parses every `.yaml` file inside
   - Handles errors gracefully

3. **Suggestion Generation:** The `generateVariableSuggestions()` function:
   - Takes parsed storage files
   - Recursively generates dot-notation paths
   - Handles objects, arrays, and nested structures
   - Creates Monaco-compatible suggestions

4. **Real-Time Updates:** Because it runs on every keystroke:
   - New files are detected immediately
   - Modified content shows updated values
   - Deleted files are removed from suggestions
   - No caching or manual refresh needed!

### Performance Notes

- **Fast:** Parsing is done in-memory, very quick
- **Efficient:** Only parses YAML when `${` is typed
- **Robust:** Invalid YAML doesn't break the editor
- **Scalable:** Handles dozens of storage files easily

---

## Troubleshooting

### Issue: New file not showing in suggestions
**Solution:** 
- Ensure filename ends with `.yaml`
- Verify file is inside a `storage` directory
- Check YAML syntax is valid
- Try typing `${` again to trigger parsing

### Issue: Suggestions show old values
**Solution:**
- The editor auto-saves, but verify changes are saved
- Try clicking outside the file and back
- Suggestions should update immediately on next `${`

### Issue: No suggestions at all
**Solution:**
- Press `Ctrl+Space` to manually trigger IntelliSense
- Check browser console (F12) for errors
- Verify you're in a `.yaml` file
- Make sure you typed `${` exactly

---

## Summary

✅ **Dynamic file detection works!**
- New storage YAML files are automatically detected
- No refresh or reload needed
- Works with any filename ending in `.yaml`
- Handles nested structures and arrays
- Gracefully handles invalid YAML
- Updates in real-time as you edit

**The enhancement is complete and ready for testing!** 🎉
