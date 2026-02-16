# Modernization Checklist

Use this checklist to modernize the SamplePlugin or any Voter Science plugin.

## Pre-Modernization

- [ ] Backup current working plugin
  ```bash
  cp -r SamplePlugin SamplePlugin.backup
  ```
- [ ] Verify current setup works
  ```bash
  npm install
  npm run build
  npm run start
  ```
- [ ] Document any custom changes you've made
- [ ] Commit to git (if using version control)

---

## Phase 1: Switch to Local Packages ✅ Safe

- [ ] **Test current setup first**
  ```bash
  npm run build
  npm run start
  ```

- [ ] **Add webpack locally** (if needed)
  ```bash
  npm install -D webpack webpack-cli
  ```

- [ ] **Verify scripts still work**
  ```bash
  npm run build    # Should use local webpack
  npm run start    # Should work the same
  ```

- [ ] **Optional: Remove global webpack** (do this carefully!)
  ```bash
  # Check what's installed globally
  npm list -g --depth 0

  # Only remove if you're sure no other projects need it
  # npm uninstall -g webpack webpack-cli
  ```

---

## Phase 2: Replace Deprecated Loader ✅ Safe

- [ ] **Backup current webpack config**
  ```bash
  cp webpack.config.js webpack.config.js.backup
  ```

- [ ] **Install ts-loader**
  ```bash
  npm install -D ts-loader@^9.5.1
  ```

- [ ] **Update webpack.config.js**
  ```bash
  cp webpack.modern.config.js webpack.config.js
  ```

  Or manually change line 19 from:
  ```javascript
  { test: /\.tsx?$/, loader: "awesome-typescript-loader" }
  ```

  To:
  ```javascript
  {
    test: /\.tsx?$/,
    loader: "ts-loader",
    exclude: /node_modules/
  }
  ```

- [ ] **Remove old loader**
  ```bash
  npm uninstall awesome-typescript-loader
  ```

- [ ] **Test build**
  ```bash
  npm run build
  ```

- [ ] **Test plugin**
  ```bash
  npm run start
  # Verify plugin works in browser
  ```

---

## Phase 3: Update TypeScript 🟡 Test Carefully

- [ ] **Backup current setup**
  ```bash
  cp package.json package.json.backup
  cp tsconfig.json tsconfig.json.backup
  ```

- [ ] **Update TypeScript**
  ```bash
  npm install -D typescript@^5.7.3
  ```

- [ ] **Update @types packages**
  ```bash
  npm install -D @types/node@^20.17.10
  npm install -D @types/react@^17.0.80
  npm install -D @types/react-dom@^17.0.25
  ```

- [ ] **Optionally update tsconfig.json**
  ```bash
  cp tsconfig.modern.json tsconfig.json
  ```

- [ ] **Build and check for type errors**
  ```bash
  npm run build
  ```

- [ ] **Fix any type errors** that appear
  - Add `skipLibCheck: true` if needed
  - Update imports if necessary
  - Fix strict null checks if enabled

- [ ] **Test plugin thoroughly**
  ```bash
  npm run start
  # Test all features in browser
  ```

---

## Phase 4: Update Other Dev Dependencies 🟡 Test Carefully

- [ ] **Update webpack (if not done already)**
  ```bash
  npm install -D webpack@^5.97.1 webpack-cli@^5.1.4
  ```

- [ ] **Update source-map-loader**
  ```bash
  npm install -D source-map-loader@^5.0.0
  ```

- [ ] **Clean install**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- [ ] **Test build**
  ```bash
  npm run build
  ```

- [ ] **Test plugin**
  ```bash
  npm run start
  # Thoroughly test all features
  ```

---

## Phase 5: Apply All Modern Configs (Nuclear Option) 🔴 High Risk

**Only do this if phases 1-4 worked!**

- [ ] **Backup everything**
  ```bash
  cp package.json package.json.backup
  cp webpack.config.js webpack.config.js.backup
  cp tsconfig.json tsconfig.json.backup
  ```

- [ ] **Apply modern configs**
  ```bash
  cp package.modern.json package.json
  cp webpack.modern.config.js webpack.config.js
  cp tsconfig.modern.json tsconfig.json
  ```

- [ ] **Clean install**
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```

- [ ] **Build**
  ```bash
  npm run build
  ```

- [ ] **Run**
  ```bash
  npm run start
  ```

- [ ] **Test everything**
  - [ ] Plugin loads
  - [ ] Authentication works
  - [ ] Sheet selection works
  - [ ] Data displays correctly
  - [ ] All TRC components render
  - [ ] No console errors
  - [ ] All interactive features work

---

## Verification Checklist

After modernization, verify:

### Build System
- [ ] `npm install` completes without errors
- [ ] `npm run build` produces `dist/bundle.js`
- [ ] No global webpack required
- [ ] Source maps work (can debug .tsx files)

### Plugin Functionality
- [ ] `npm run start` launches dev server
- [ ] Plugin loads at `http://localhost:3000/index.html`
- [ ] Login/authentication works
- [ ] Sheet selection screen appears
- [ ] Sheet data loads correctly
- [ ] All UI components render properly

### Components Check
- [ ] PluginShell renders
- [ ] Panel components display
- [ ] SimpleTable shows data
- [ ] Buttons work
- [ ] Inputs work (TextInput, SelectInput, etc.)
- [ ] Modal opens/closes
- [ ] Tabs/Accordion work
- [ ] No visual regressions

### Browser Console
- [ ] No JavaScript errors
- [ ] No TypeScript compilation errors
- [ ] No React warnings
- [ ] Source maps load correctly

### Performance
- [ ] Build time is acceptable
- [ ] Plugin loads quickly
- [ ] No significant slowdowns

---

## Rollback Procedure

If something goes wrong:

### Quick Rollback (Single File)
```bash
# If you backed up files with .backup extension
cp package.json.backup package.json
cp webpack.config.js.backup webpack.config.js
cp tsconfig.json.backup tsconfig.json
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Full Rollback (Entire Directory)
```bash
# If you backed up the entire directory
cd ..
rm -rf SamplePlugin
mv SamplePlugin.backup SamplePlugin
cd SamplePlugin
npm install
npm run build
```

### Git Rollback (If Using Version Control)
```bash
git status
git restore package.json webpack.config.js tsconfig.json
npm install
npm run build
```

---

## Troubleshooting

### Build fails after updating TypeScript
**Fix**: Add to tsconfig.json:
```json
"skipLibCheck": true
```

### Build is much slower
**Fix**: Add to webpack.config.js ts-loader options:
```javascript
{
  test: /\.tsx?$/,
  loader: "ts-loader",
  options: {
    transpileOnly: true  // Skip type checking for faster builds
  }
}
```

### TRC components don't work after updates
**Fix**: Revert React and TypeScript to original versions - TRC libs may have dependencies

### "Cannot find module" errors
**Fix**:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Plugin loads but displays incorrectly
**Fix**: Check browser console for errors, may need to revert Emotion or React updates

---

## Success Criteria

You've successfully modernized when:

✅ No global npm packages required (except npm itself)
✅ All `npm run` scripts work locally
✅ Build completes without warnings
✅ Plugin runs and functions identically to before
✅ TypeScript compilation is clean
✅ Source maps work for debugging
✅ Other developers can clone and run without global installs

---

## After Modernization

- [ ] Update your README with new instructions
- [ ] Document any changes you made
- [ ] Share modernized config files with team
- [ ] Update CI/CD scripts if needed
- [ ] Test on clean machine to verify reproducibility

---

## Notes

- Take it slow - don't modernize everything at once
- Test after each phase
- Keep backups until you're confident
- Document what works and what doesn't
- Some TRC library constraints may prevent full modernization
- When in doubt, keep it working rather than making it perfect

**Remember**: The goal is a reliable, reproducible build - not the latest versions!
