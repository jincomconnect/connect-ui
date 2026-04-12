
  # Jin Community Connect Website

  This is a code bundle for Social Media Website. The original project is available at https://www.figma.com/design/Zxwb4SVXVhyTJ0UlF15bBU/Social-Media-Website.

  ## Running the code

  Run `npm i` to install the dependencies.

  Run `npm run dev` to start the development profile.

  Run `npm run dev:test` to start the app with the test profile.

  Run `npm run dev:prod` to start the app with the production profile.

  ## Profiles and backend endpoints

  This project now uses Vite modes to switch environment profiles.

  - `development` reads from `.env.development`
  - `test` reads from `.env.test`
  - `production` reads from `.env.production`

  Update `VITE_API_BASE_URL` in those files to point each profile to the correct backend.

  In the app, import the runtime config from `src/app/config/env.ts`:

  ```ts
  import { appConfig, buildApiUrl } from './app/config/env';

  fetch(buildApiUrl('/health'));
  console.log(appConfig.appEnv, appConfig.apiBaseUrl);
  ```

  Build commands:

  - `npm run build` builds with the production profile
  - `npm run build:dev` builds with the development profile
  - `npm run build:test` builds with the test profile
  