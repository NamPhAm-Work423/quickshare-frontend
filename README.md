<<<<<<< HEAD
# File Transfer Service - Frontend

A modern Next.js 15 application for transferring files and text notes using 6-digit codes.

## Features

- **File Upload**: Drag-and-drop file uploads with progress tracking
- **Text Notes**: Paste text directly to create shareable notes
- **6-Digit Codes**: Simple code-based file sharing
- **Auto-Download**: Automatic file downloads when code is entered
- **Expiration Timer**: Visual countdown for code expiration
- **Modern UI**: Built with TailwindCSS and ShadCN/UI components
- **Dark Mode**: System-aware theme support

## Tech Stack

- **Next.js 15** (App Router)
- **TypeScript**
- **TailwindCSS**
- **ShadCN/UI** - Component library
- **Zustand** - State management
- **react-dropzone** - File upload handling

## Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

## Installation

1. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

2. Set up environment variables:

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
```

Replace `http://localhost:3001` with your backend API URL.

## Development

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Building for Production

Build the application:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

Start the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Project Structure

```
Frontend/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Upload page (/)
│   │   ├── receive/
│   │   │   └── page.tsx       # Receive page (/receive)
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── ui/                # ShadCN UI components
│   │   ├── upload-box.tsx     # File upload component
│   │   ├── code-display.tsx   # Code display with copy
│   │   ├── file-preview.tsx   # File preview card
│   │   ├── text-preview.tsx   # Text content display
│   │   ├── countdown-timer.tsx # Expiration timer
│   │   ├── loader.tsx         # Loading spinner
│   │   └── theme-provider.tsx # Theme context
│   ├── hooks/
│   │   └── use-toast.ts       # Toast notification hook
│   ├── lib/
│   │   ├── utils.ts           # Utility functions
│   │   └── api.ts             # API client functions
│   └── store/
│       └── upload-store.ts    # Zustand state store
├── components.json             # ShadCN configuration
├── tailwind.config.ts         # TailwindCSS configuration
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js configuration
```

## Usage

### Uploading Files

1. Navigate to the home page (`/`)
2. Drag and drop a file or click to browse
3. Alternatively, paste text directly (Ctrl+V / Cmd+V)
4. Click "Upload & Generate Code"
5. Copy the generated 6-digit code
6. Share the code with the recipient

### Receiving Files

1. Navigate to `/receive`
2. Enter the 6-digit code
3. Click "Download"
4. Files will download automatically
5. Text content will be displayed inline

## API Integration

The frontend expects a backend API with the following endpoints:

### POST /api/upload

**Request:**
- For files: `FormData` with `file` field
- For text: JSON `{ "text": "..." }`

**Response:**
```json
{
  "code": "123456",
  "expiresAt": "2024-01-01T12:00:00Z"
}
```

### POST /api/download

**Request:**
```json
{
  "code": "123456"
}
```

**Response:**
```json
{
  "type": "file",
  "url": "https://presigned-url.com/file"
}
```
or
```json
{
  "type": "text",
  "content": "Text content here"
}
```

## Error Handling

The application handles the following error scenarios:

- **Expired Codes**: Shows expiration message
- **Invalid Codes**: Prompts to check the code
- **Too Many Attempts**: Shows rate limit message
- **Network Errors**: Displays connection error
- **Upload Failures**: Shows specific error message

## Customization

### Theme

The app uses CSS variables for theming. Modify `src/app/globals.css` to customize colors.

### Backend URL

Update `NEXT_PUBLIC_BACKEND_URL` in `.env.local` to point to your backend server.

## License

MIT

=======
# quickshare-frontend
>>>>>>> be485dfab85542eb777bb240ad867767a4a4dcee
