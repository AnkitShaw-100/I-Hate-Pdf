# IHatePDF

IHatePDF is a privacy-focused web application that provides essential PDF tools for converting, splitting, and managing PDF files. All processing happens locally in the browser, ensuring that no files are uploaded or stored on any server.

## Features

- Image to PDF – Convert multiple images (JPG, PNG, etc.) into a single PDF file
- PDF Splitter – Split PDF files into individual pages or selected ranges

## Highlights

- 100% private — all processing happens in the browser
- Completely free with no subscriptions
- Fast and modern user experience
- Responsive interface for desktop and mobile devices
- Clean and intuitive UI

## Tech Stack

### Core

- **React** – JavaScript library for building interactive user interfaces with component-based architecture
- **Vite** – Fast frontend build tool and development server for optimized development experience

### Routing

- **React Router DOM** – Client-side routing for seamless navigation between pages without full page reloads

### PDF Processing

- **jsPDF** – Library for generating PDFs from images and content in the browser
- **pdf-lib** – Powerful PDF manipulation library for reading, splitting, and modifying PDF documents

### File Handling

- **file-saver** – Utility for saving files directly to the user's device

### UI Components and Styling

- **Tailwind CSS** – Utility-first CSS framework for rapid and responsive UI design
- **Radix UI** – Unstyled, low-level UI component primitives for building accessible interfaces
- **class-variance-authority** – Type-safe utility for managing component variant styles
- **clsx** – JavaScript utility for conditionally joining classNames together
- **tailwind-merge** – Utility to prevent Tailwind CSS class conflicts and merge them properly

### Icons and Animations

- **lucide-react** – Beautiful, consistent SVG icon library with React components
- **framer-motion** – Animation library for creating smooth, interactive UI transitions and effects

### Notifications and Themes

- **sonner** – Toast notification library for displaying success, error, and info messages
- **next-themes** – Theme management system for implementing dark and light mode support

## Project Structure

```
ihatepdf/
├── src/
│   ├── components/
│   │   ├── tools/
│   │   │   ├── ImageToPdf.jsx
│   │   │   ├── PdfSplitter.jsx
│   │   │   ├── WordToPdf.jsx
│   │   │   └── PdfToWord.jsx
│   │   ├── ui/
│   │   ├── DropZone.jsx
│   │   ├── ImagePreview.jsx
│   │   └── ConvertButton.jsx
│   ├── pages/
│   │   ├── Index.jsx
│   │   └── NotFound.jsx
│   ├── hooks/
│   ├── lib/
│   ├── App.jsx
│   └── main.jsx
├── public/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── components.json
└── package.json
```

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ihatepdf.git
cd ihatepdf
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the application at:

```
http://localhost:5173
```

## How It Works

### Image to PDF

Upload multiple images, arrange them in order, and generate a single PDF file directly in the browser.

### PDF Splitter

Upload a PDF file, choose page ranges or individual pages, and download the separated files.

### Word to PDF

Upload a .docx document and convert it into a PDF file.

### PDF to Word

Upload a PDF file and convert the content into an editable Word document. Often works better for portfolios.
