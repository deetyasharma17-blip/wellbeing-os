# AI Wellbeing OS

A browser-based wellbeing prototype using fictional demonstration readings. It is not a medical device and does not diagnose or provide medical advice.

## Run locally

Requires Node.js 18 or newer and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. Run `npm test` for the pattern-engine tests and `npm run build` for a production build.

## Prototype boundaries

- Profiles and login are local demonstrations, not authentication. There is no backend, encryption, or secure account. Avoid entering sensitive information.
- Readings are fictional. Device connections and permissions are simulated; no real integrations or notifications are active. Demo preferences, edited readings, and check-ins are stored in browser local storage. Settings can reset them.
- Insights compare the latest three days to up to 14 earlier days with simple rules; they do not use an AI model or infer a diagnosis. Assistant replies are contextual, rule-based demonstrations.
- Reports can be exported using the browser's print dialog and “Save as PDF”.
- A real deployment requires secure authentication, appropriate data protection and consent, backend storage, integration APIs (and possibly companion mobile apps), notification infrastructure, and clinical/safety review. No individual data is shared with institutions by this prototype.

Code is organised into reusable components, pages, demo data, analysis logic, and storage utilities under `src/`.

The connected-device prototype is intentionally modular. Simulated phone, tablet, and laptop activity signals are combined by `src/services/activity.js` and shown on the Activity Timeline page. A normal browser cannot read operating-system Screen Time or UsageStats data directly: future Android integrations would require `UsageStatsManager` and Usage Access, Apple integrations require supported APIs and entitlements, and laptop data would require supported browser or native integrations. Until those services exist, the UI labels all connection and activity values as simulated.

The current account and onboarding flow is also a development-only browser experience. It stores one account record and a SHA-256 password digest in local storage, not a production authentication system; it does not provide server-side sessions, email verification, password recovery, or account security. A backend authentication service must replace this before collecting real device data.

The separate `WellbeingConnector/` directory contains a native SwiftUI iPhone companion scaffold. It is independent of the React website and uses FamilyControls, DeviceActivity, and a Device Activity Report extension. See [WellbeingConnector/README.md](./WellbeingConnector/README.md) for entitlements, Apple permission limits, and physical-device testing instructions.

## Publish a public website link

The local address `127.0.0.1:4173` is only visible on this computer. This project includes [netlify.toml](./netlify.toml) for Netlify deployment. Build with `npm run build`, then either drag the `dist/` folder into [Netlify Drop](https://app.netlify.com/drop) or connect this project in Netlify. Netlify will provide a public HTTPS URL that works on phones and laptops.

GitHub Pages is also configured through [deploy-pages.yml](./.github/workflows/deploy-pages.yml). Push the project to a GitHub repository using the `main` branch, enable **Settings → Pages → GitHub Actions**, and the workflow will publish the site at `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`.
