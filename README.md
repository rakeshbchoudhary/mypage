# Rakesh B Choudhary — Portfolio

A modern, minimal, token-driven portfolio website. Fully responsive with light/dark themes, accessible, and optimized for GitHub Pages.

## Project Structure
- src/index.html — main page
- src/styles/ — site and game stylesheets
- src/scripts/ — site and game scripts
- src/images/ and src/certificates/ — images and certificates
- dist/ — legacy generated output; GitHub Pages deploys directly from `src/`

## Design System
- CSS custom properties for:
  - Colors, spacing, radii, borders, shadows, transitions, typography
- Minimal interactive states
- Consistent visual language across light/dark modes

## Development
- Open src/index.html in a browser (no framework required).
- Edit modular CSS and JS under src/.

## Deploy to GitHub Pages
The repository includes a manual GitHub Actions workflow that publishes the contents of `src/` from any branch to the same live Pages URL.

One-time setup:
1. Push this workflow to the repository's default branch.
2. In GitHub, open **Settings → Pages** and set **Build and deployment → Source** to **GitHub Actions**.

To publish a branch:
1. Open the repository's **Actions** tab and choose **Deploy GitHub Pages**.
2. Select **Run workflow**, enter the branch name to publish, and run it.
3. Wait for the workflow to finish; the Pages URL is shown in the deployment job.

Each run replaces the live site with that branch's version. The workflow copies `src/` directly, so it does not deploy the checked-in `dist/` snapshot. The workflow file must first be present on the default branch for manual runs to be available.

## Branching
- Branches contain source; choose the branch to publish when running the deployment workflow.
- The live Pages site shows only the most recently deployed branch.

## License
This portfolio and content © Rakesh B Choudhary. All rights reserved.
