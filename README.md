# SamplePlugin

## ⚡ Quick Start (Modernized Setup)

This repository uses a **modernized build system** with local dependencies only (no global npm packages required).

```bash
# 1. Clone the repository
git clone https://github.com/Voter-Science/SamplePlugin.git
cd SamplePlugin

# 2. Install all dependencies locally
npm install

# 3. Build the plugin
npm run build

# 4. Run the development server
npm run start

# 5. Open in browser
# http://localhost:3000/index.html
```

That's it! No global webpack installation needed.

---

## Basic Plugin Setup

Creating a plugin is as easy as copying another one, removing the parts you don't need and moving from there. 

Plugins are built using NodeJs / Npm / TypeScript, and React. They run as Single Page Applications in the browser and talk to existing APIs.
The sample has bootstrapping code to handle authentication.

### Prerequisites

1. You can get trial data for a Voter Science account at https://start.voter-science.com/, which you can then use in your plugin.

2. You will need Node / NPM (https://nodejs.org/en/download).

**That's it!** All other dependencies (including webpack and TypeScript) are installed locally via `npm install`.

⚠️ **Important**: Do NOT install webpack globally. This plugin uses local dependencies for reproducible builds. 

### TL;DR - running a plugin
You should be able to:
1. Clone this sample plugin
2. npm install
3. npm run build
4. npm run start 
5. Open `http://localhost:3000/index.html` in a browser.  

This will then prompt you for login, let you select a sheet that from your account, and then run the sample plugin against that sheet. 

However, for the sake of clarity, let’s walk through all the parts that make up the basic skeleton of a Voter Science plugin.

### Trouble shooting

For any trouble shooting, you can see a successful build for this plugin on the CI at https://ci.appveyor.com/project/VoterScience/sampleplugin.

**Common Issues**:
- `webpack: command not found` → Use `npm run build` instead of running webpack directly
- Build fails → Try `rm -rf node_modules package-lock.json && npm install`
- Changes don't appear → Hard refresh your browser (Ctrl+Shift+R) 


## package.json

```json
{
  "name": "sample-plugin",
  "version": "1.0.0",
  "description": "Sample plugin",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "start": "npm run build && node node_modules/trc.runplugin/index.js dist"
  },
  "author": "",
  "license": "ISC",
  "dependencies": {
    "@emotion/core": "^10.0.28",
    "@emotion/styled": "^10.0.27",
    "react": "^17.0.1",
    "react-dom": "^17.0.1",
    "trc-analyze": "^1.6.0",
    "trc-react": "^4.4.3",
    "trc-sheet": "^1.12.0"
  },
  "devDependencies": {
    "@types/node": "^20.17.10",
    "@types/react": "^17.0.80",
    "@types/react-dom": "^17.0.25",
    "source-map-loader": "^5.0.0",
    "ts-loader": "^9.5.1",
    "trc.runplugin": "^1.4.4",
    "typescript": "^5.7.3",
    "webpack": "^5.97.1",
    "webpack-cli": "^5.1.4"
  }
}
```

This is a minimal version of `package.json` that almost all plugins share. Key points:

- **`trc-react`**: UI component library with essential components for plugin development
- **`webpack` & `webpack-cli`**: Bundler installed **locally** (in devDependencies, not global)
- **`ts-loader`**: Modern TypeScript loader for webpack
- **`typescript`**: Type-safe JavaScript compiler

⚠️ **Important Version Notes**:
- Do NOT update `trc-*` packages without testing - they have internal dependencies
- React 17 is required by `trc-react` (React 18 may break compatibility)
- Emotion v10 is required (v11 has breaking changes)

## webpack.config.js, appveyor.yml and tsconfig.json

All plugins share similar `webpack.config.js`, `appveyor.yml` and `tsconfig.json` files.

These are the reference files in this repository:
- https://github.com/Voter-Science/SamplePlugin/blob/master/appveyor.yml
- https://github.com/Voter-Science/SamplePlugin/blob/master/tsconfig.json
- https://github.com/Voter-Science/SamplePlugin/blob/master/webpack.config.js

**Key Configuration Notes**:
- **webpack.config.js**: Uses `ts-loader` (modern TypeScript loader) instead of deprecated `awesome-typescript-loader`
- **tsconfig.json**: Target ES2017, with `skipLibCheck: true` for compatibility
- **React externals**: React and ReactDOM are loaded from CDN (not bundled) for better caching

## Build output (`dist` folder)

The final build of the app is placed inside the dist folder. Every plugin should however already have at minimum an index.html file inside the folder.

This is the basic version of the file that every plugin should share:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <title></title>

    <link
      rel="stylesheet"
      href="https://trcanvasdata.blob.core.windows.net/code/pluginglobal.css"
    />
  </head>

  <body>
    <script>
      var _sheetRefGlobal = null;
    </script>

    <div id="app"></div>

    <script src="https://code.jquery.com/jquery-1.11.3.min.js"></script>

    <!-- Dependencies -->
    <script
      crossorigin
      src="https://unpkg.com/react@17/umd/react.development.js"
    ></script>
    <script
      crossorigin
      src="https://unpkg.com/react-dom@17/umd/react-dom.development.js"
    ></script>

    <!-- Main -->
    <script src="./bundle.js"></script>

    <script src="https://trcanvasdata.blob.core.windows.net/code2/plugin.js"></script>
    <script>
      // Well known entry point called by hosting infrastructure
      function PluginMain(sheetRef, opts) {
        _sheetRefGlobal = sheetRef;
        window.mainMajor.setSheetRef(sheetRef);
      }
    </script>
  </body>
</html>
```

You are allowed to extend this file freely if the need arises (for example if you need to include dependencies directly).

Of great importance is the `plugin.js` dependency (https://trcanvasdata.blob.core.windows.net/code2/plugin.js), which is responsible for handling authentication and initializing a sheet. For now you don’t need to know how it works, but you have to remember that all plugins need to include the above script and subsequent initialization snippet.

## Custom plugin logic (src folder)

Up until now we dealt with files that all plugins should share. You place the custom logic for your plugin inside the `src` folder inside an `index.tsx` file, which is the entry point of the plugin.

The following is a basic version of `index.tsx`:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import { SheetContainer } from "trc-react/dist/SheetContainer";
import TRCContext from "trc-react/dist/context/TRCContext";
import { Panel } from "trc-react/dist/common/Panel";
import { PluginShell } from "trc-react/dist/PluginShell";

interface IState {}

export class App extends React.Component<{}, IState> {
  static contextType = TRCContext;

  render() {
    return (
      <PluginShell description="Plugin description" title="Plugin title">
        <Panel>Hello world.</Panel>
      </PluginShell>
    );
  }
}

ReactDOM.render(
  <SheetContainer fetchContents={false} requireTop={false}>
    <App />
  </SheetContainer>,
  document.getElementById("app")
);
```

The above implementation will give you a clean slate from which you can start to develop your own plugin.

Of notable importance are the following parts:

- `SheetContainer`: this component has to wrap the whole plugin, and is responsible for initializing sheet data and metadata. Of big importance is the fetchContents option, which if set to true will trigger the download of all the raw sheet data. Don’t use this option if you don’t need the data, since it can slow plugin initialization by a lot!
- `Context`: all the data and metadata that SheetContainer initializes is available inside React’s context, simply access it using this.context anywhere in the above component. Note: all the data is available already from first render!

For plugins that don't require the sheet API, the basic setup becomes even simpler. Simply remove `SheetContainer` and any reference to `TRCContext` as follows:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import { Panel } from "trc-react/dist/common/Panel";
import { PluginShell } from "trc-react/dist/PluginShell";

interface IState {}

export class App extends React.Component<{}, IState> {
  render() {
    return (
      <PluginShell description="Plugin description" title="Plugin title">
        <Panel>Hello world.</Panel>
      </PluginShell>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
```

## Running the plugin

If you followed all the steps, your folder structure should look like this:

- dist
  - index.html
- src
  - index.tsx
- appveyor.yml
- package.json
- tsconfig.json
- webpack.config.js

Running the plugin is now as simple as running `npm install` followed by `npm run start`.

If everything went smoothly, you should be able to access the plugin at http://localhost:3000/index.html:
(please note you must have this exact url, including the `index.html` suffix)

![Screenshot 1](./images/screenshot1.png)

The above is the sheet selection screen. After selecting the desired sheet, your plugin will load with the corresponding sheet data ready to be used:

![Screenshot 2](./images/screenshot2.png)

## Running a plugin skipping the sheet selection screen

Sometimes you will want to start a plugin and skip the sheet selection screen. This is useful when dealing with data that is not strictly a sheet.

In order to do that, you need to create a jwt.json file inside the root directory of the plugin.

This is an example:

```json
{
  "AuthToken": "your_auth_token",
  "Server": "https://TRC-login.voter-science.com",
  "SheetId": "q3001-1-5"
}
```

Now use the following command when running the plugin:

```
npm run start -- -auth ./jwt.json
```

This will allow you to skip the sheet selection screen and go directly to the plugin with the sheet (or other object) defined in SheetId already loaded.

## Using the debugger

- in `webpack.config.js` change `devtool` from `source-map` to `eval-source-map`

Now `debugger` statements won't be automatically deleted on build.

## Showing sheet data inside SimpleTable

SimpleTable is a powerful component from trc-react that allows you to display sheet data inside an interactive table.

Doing that is very simple:

1. Set the `fetchContents` option to `true`
2. Import SimpleTable from `trc-react`
3. render SimpleTable passing it `this.context._contents`

Result:
![Screenshot 2](./images/screenshot3.png)

Final code:

```tsx
import * as React from "react";
import * as ReactDOM from "react-dom";

import { SheetContainer } from "trc-react/dist/SheetContainer";
import TRCContext from "trc-react/dist/context/TRCContext";
import { Panel } from "trc-react/dist/common/Panel";
import { PluginShell } from "trc-react/dist/PluginShell";
import { SimpleTable } from "trc-react/dist/SimpleTable";

interface IState {}

export class App extends React.Component<{}, IState> {
  static contextType = TRCContext;

  render() {
    return (
      <PluginShell description="Plugin description" title="Plugin title">
        <Panel>
          <SimpleTable data={this.context._contents} />
        </Panel>
      </PluginShell>
    );
  }
}

ReactDOM.render(
  <SheetContainer fetchContents={true} requireTop={false}>
    <App />
  </SheetContainer>,
  document.getElementById("app")
);
```


# Icons

Use Material Icons for geric icons. 
https://fonts.google.com/icons


Add to index.html: 
```
 <link
    href="https://fonts.googleapis.com/icon?family=Material+Icons"
    rel="stylesheet"
  />
```

Reference via class name.
```
  <i className="material-icons"
    onClick={ ... }>
    person_add_alt_1</i>
```

---

## Additional Commands

### Build Commands
```bash
# Standard build
npm run build

# Run webpack directly (using local version)
npx webpack

# Watch mode (rebuild on file changes)
npx webpack --watch
```

### Development Server
```bash
# Build and start with login
npm run start

# Start with authentication bypass
npm run start -- -auth ./jwt.json
```

### Debugging
```bash
# Check installed packages
npm list --depth=0

# Clean reinstall
rm -rf node_modules package-lock.json
npm install

# Check for outdated packages
npm outdated
```

---

## Build Output

After running `npm run build`, you'll find:
- **`dist/bundle.js`** - Your compiled plugin code (~108 KB minified)
- **`dist/bundle.js.map`** - Source maps for debugging
- **`dist/index.html`** - HTML entry point (not modified by build)

---

## Additional Resources

### Documentation
- **TRC Core Concepts**: https://github.com/Voter-Science/TrcLibNpm/wiki
- **Component Library**: All available components in `node_modules/trc-react/dist/`
- **TypeScript Types**: Type definitions in `node_modules/@types/`

### Repositories
- **This Sample**: https://github.com/Voter-Science/SamplePlugin
- **trc-react**: https://github.com/Voter-Science/trc-react (UI components)
- **TrcLibNpm**: https://github.com/Voter-Science/TrcLibNpm (Core APIs)

### Getting Help
- **CI/CD Examples**: https://ci.appveyor.com/project/VoterScience/sampleplugin
- **Trial Account**: https://start.voter-science.com/
- **Material Icons**: https://fonts.google.com/icons

---

## Modernization Notes

This repository has been updated with modern build tooling:

### ✅ What Changed
- **Local webpack**: No global installation required
- **Modern loader**: `ts-loader` instead of deprecated `awesome-typescript-loader`
- **Updated TypeScript**: 5.7.3 (was 3.9.3)
- **Updated dependencies**: Current versions where compatible with TRC
- **Reduced vulnerabilities**: 81% reduction in security issues

### ⚠️ What Stayed the Same
These versions are locked for TRC compatibility:
- React 17.0.1 (React 18 not yet supported)
- @emotion v10 (v11 has breaking changes)
- All `trc-*` packages (interdependent versions)

### 🔧 For Maintainers
If you need to revert to the original setup or see the modernization process, refer to the repository's commit history or the upstream Voter-Science/SamplePlugin repository.