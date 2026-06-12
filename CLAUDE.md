# LiveTranslate

Browser app for simultaneous speech transcription (Deepgram) and translation
(DeepL). Create React App + TypeScript. Hosted at
https://livetranslate.fiodorov.es via S3 + CloudFront.

## Commands

- `npm start` — dev server
- `npm run build` — production build into `build/`
- `npm test` — tests (react-scripts/jest)

## Deployment

Static site served from S3 behind CloudFront:

- S3 bucket: `s3://livetranslate` (eu-west-2)
- CloudFront distribution: `E3H1EXOJ3711PX` (d1n21wxfeuv3mq.cloudfront.net,
  alias livetranslate.fiodorov.es)

Deploy steps:

```sh
npm run build
aws s3 sync build/ s3://livetranslate --delete
aws cloudfront create-invalidation --distribution-id E3H1EXOJ3711PX --paths "/*"
```

## Architecture notes

- `src/context.tsx` — `StreamingContext`: streaming state, fullscreen
  management, API tokens.
- `src/deepgram/` — Deepgram WebSocket URL building and response parsing.
- `src/translate.ts` — DeepL translation, supported language pairs.
- `src/settings.tsx` — API keys are passed via URL query params
  (`deeplToken`, `deepgramToken`, `useDeeplPro`), not stored server-side.
- `src/App.css` / `src/index.css` — dark theme with CSS variables defined in
  `:root` (`--bg`, `--surface`, `--accent`, etc.); subtitle bars are
  `.sub-top` / `.sub-bottom`.
- `build/` is committed in the repo but is generated output.
