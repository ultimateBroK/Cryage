This is the [assistant-ui](https://github.com/Yonom/assistant-ui) starter project.

## Getting Started

First, create a `.env.local` file in the root directory and add your Google AI API key:

```bash
# Create the environment file
touch .env.local
```

Then add your Google AI API key to `.env.local`:

```
GOOGLE_API_KEY=your-google-ai-api-key-here
```

Get your API key from: https://makersuite.google.com/app/apikey

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
