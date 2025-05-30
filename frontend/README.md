# CodeWeaver Frontend

This React application provides a simple interface for interacting with the CodeWeaver backend. It was bootstrapped manually with a Vite-like structure and uses Tailwind CSS for styling.

## Development

1. Install dependencies

```bash
npm install
```

2. Start the development server

```bash
npm run dev
```

The app expects the backend to expose the endpoint `/api/generate/`.

## Build

```bash
npm run build
```

## Project Structure

- `src/components` – reusable UI components
- `src/pages` – application pages
- `src/services` – API helper using Axios

## Notes

Since this environment doesn't include preinstalled node modules, you may need to install them before running the project.
