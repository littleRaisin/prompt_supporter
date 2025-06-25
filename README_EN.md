# Prompt Supporter

Prompt Supporter is a tool designed to streamline prompt management for image generation.

In particular, when using Stable Diffusion-based models (such as IL/NAI) that utilize Danbooru tags as keywords, or when selecting trigger words for LoRA, accurate prompt input greatly affects the quality of the generated images. However, the translation between Japanese and English is not always intuitive, and managing keywords related to specific copyrights or searching and managing Danbooru tags associated with characters can be cumbersome.

This tool helps alleviate the following issues:

- You can manually register and search for keywords such as Danbooru tag translations, copyright names, and costume sets associated with characters.
- You can also search using arbitrary keywords you set yourself (e.g., tag names written in memos such as `twintails`, or Japanese titles written in search words), providing flexible prompt search.
  - This allows you to extract characters with twintails or search for characters appearing in the same work.
- You can easily copy registered tag names, memos, etc.

This tool was developed to fulfill the personal desire to eliminate the need to leave huge memos on ComfyUI or build a dedicated UI, and to outsource information organization.

## Caution

**This tool uses SQLite for data management. If the number of registered items becomes too large, performance may degrade.**

## Development Environment

This tool has been developed and tested on a Windows 11 environment. Operation on other OSes has not been confirmed.

- Electron
- Vite
- React
- TypeScript
- TailwindCSS
- SQLite

### Directory Structure

-   `src/electron/`: Code related to Electron's main process and preload script
-   `src/ui/`: Code related to the React application's UI
-   `src/db/`: Code related to the SQLite database
-   `src/i18n/`: Code related to internationalization (i18n)
-   `src/types/`: TypeScript type definition files
-   `src/stories/`: Storybook story files
-   `public/`: Static files

## Development Procedure

### Prerequisites

-   Node.js (v18 or higher)
-   npm (included with Node.js)
-   volta (recommended): Node.js version management tool. Automatically uses the Node.js version specified in the project.

### Installation Method

1.  **Install Node.js and npm**:
    The project uses Node.js and npm. We recommend using `volta` for Node.js version management. If `volta` is installed, the Node.js version defined in the project's `package.json` will be automatically applied.

    For information on how to install `volta`, please refer to the [Volta official documentation](https://docs.volta.sh/guide/getting-started).

2.  **Install Dependencies**:
    Run the following command in the project's root directory to install the necessary dependencies.

    ```bash
    npm install
    ```

    **Notes for each OS**:
    -   **Windows/macOS/Linux**: Because it uses native modules such as `better-sqlite3`, you may need to run `electron-rebuild` after `npm install`.
        ```bash
        npm run rebuild
        ```
        This command rebuilds the native modules to match the Electron version.

### Commands

You can run the following commands in the project's root directory.

-   **Start in Development Mode**:
    Starts the application in development mode. Changes are automatically reloaded.
    ```bash
    npm run dev
    ```

-   **Start in Preview Mode**:
    Starts the built application in preview mode.
    ```bash
    npm run preview
    ```

-   **Run Tests**:
    Runs unit tests.
    ```bash
    npm test
    ```
    To run tests with UI, use the following:
    ```bash
    npm run test:ui
    ```

### Build Method

To build the application in a distributable format, run the following command.

```bash
npm run build
```

This command executes `electron-forge make` and generates an executable file for your OS (e.g., `.exe` on Windows, `.dmg` or `.app` on macOS, `.deb` or `.rpm` on Linux).

**Output Path for each OS**:
The built files are usually generated in the `out/` directory.
-   **Windows**: `out/make/squirrel.windows/` or `out/make/zip/win32/`
-   **macOS**: `out/make/zip/darwin/` or `out/make/dmg/`
-   **Linux**: `out/make/deb/` or `out/make/rpm/`
