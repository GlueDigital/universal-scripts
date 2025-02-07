## Migrating from v1

Universal Scripts v2 is a huge change from v1, and we couldn't apply all the updates while keeping backwards compatibility.
If you have a project on v1, we recommend that you can keep using it, but if you're set on upgrading to v2, check the changelog below to find out which changes you'll need to make for it to keep working.

### Changelog

- Removed fetchData support. Fix: replace it with useFetch
- Updated react-router to v5. Fix: update your routes at `src/routes/` with the new syntax
- Updated react-intl to v3. Fix: remove anything related to `locale-data` from `src/locales/index.js`
- Replaced react-helmet with react-helmet-async. Fix: update your imports
- Removed `src/index.js`. Fix: move your code to `runtime.conf.d/client/05-init.js`
- Removed `src/routes/serverRoutes.js`. Fix: move your code to `runtime.conf.d/server/05-api.js`
- Renamed `src/styles/main.sass` to `src/styles/index.sass`.
