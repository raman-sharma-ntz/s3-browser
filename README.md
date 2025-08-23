# S3 Browser

A simple web-based file explorer for AWS S3 buckets built with Bun, Express, TypeScript, and TailwindCSS.

## 🚀 Introduction

S3 Browser is a lightweight application that allows you to browse, preview, and download files from your AWS S3 buckets via a modern web interface. It is designed for simplicity, speed, and security.

## 📝 Problem Statement

Managing files on AWS S3 via the console can be cumbersome, especially for large buckets or nested directories. S3 Browser solves this by providing an intuitive UI for file navigation and download.

## ⚡ Features

- Browse S3 buckets like a local file system
- Breadcrumb navigation for easy folder traversal
- Preview files with quick Open functionality
- Download individual files, folders, or all files as ZIP
- Truncated filenames with tooltips for long names
- Secure AWS session-based access
- Disconnect functionality to clear AWS credentials

## 🔧 How It Works

- Uses AWS SDK to fetch objects from the S3 bucket
- Renders folders and files as a collapsible tree on the sidebar
- Displays file previews in the content area
- Handles downloads with `archiver` for ZIP packaging
- Frontend built with plain JavaScript, TailwindCSS for UI, and Express for backend API

## 📖 Usage

### 1. Start the Application

Run the development server:

```bash
bun run src/index.ts
```

Or with npm:

```bash
npm run dev
```

Open your browser and go to:

```
http://localhost:3000
```

### 2. Login / AWS Configuration

- The app requires AWS credentials to access the S3 bucket.
- You can provide them via a session login page

### 3. Browse Files and Folders

- Click on folders (📂) to navigate inside them.
- Use the **breadcrumb navigation** at the top to move back to parent folders.
- Folder and file names are truncated with hover tooltips for long names.

### 4. Preview Files

- Click on a file (📄) to preview it.
- The preview shows:

  - File name
  - Open button to view in a new tab
  - Download button to download the file directly

### 5. Download Options

#### a) Download Single File

- Click the **⬇️ Download** button on the file card or in the preview page.

#### b) Download Folder

- While inside a folder, click **⬇️ Download Folder** at the top.
- All files in the folder will be packaged into a ZIP and downloaded.

#### c) Download All Files

- Click the **⬇️ Download All** button at the top.
- All files in the bucket will be packaged into a ZIP and downloaded.

### 6. Disconnect / Logout

- Click the **Disconnect** button to end the session and clear AWS credentials.

## 🛡 Security

- No AWS credentials are stored permanently.
- Session-based access ensures credentials are cleared after disconnect.
- Downloads are handled on the server-side to prevent exposing direct S3 links.

## ⚙️ Backend

- Express.js handles API requests for listing objects, downloading files, and downloading folders.
- AWS SDK fetches S3 bucket contents.
- `archiver` library is used to package files/folders into ZIPs.

## 🎨 Frontend

- JavaScript dynamically renders the tree and content view.
- TailwindCSS for responsive and modern UI.
- Buttons and tooltips for user-friendly interactions.
