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

Get your API key from: https://aistudio.google.com/apikey

Then, run the development server:

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
