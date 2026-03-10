# Questionnaire

A React/Next.js application for displaying and filling out questionnaires.

## Features

- **Dynamic questionnaires**: Conditional follow-up questions triggered by user
  input.
- **State persistence**: Progress is persisted to local storage so the user can
  resume at any time.
- **Accessibility**: Support for full keyboard navigation and screen readers
  across all form inputs and interactive elements.
- **Custom styled form inputs**: Radio buttons and other form elements are
  uniquely styled to match the design requirements while preserving native
  semantics.
- **Responsive design**: Layouts and typography adjust gracefully to mobile,
  tablet, and desktop screens.
- **Results**: A summary page displaying responses and calculating average
  scores.

## Tech stack

### Core framework & state management

- **Next.js 16 (App Router)**: Follows modern Next.js architectural patterns by
  separating Server Components (for static layouts and data handling) from
  Client Components (for interactivity and Zustand state).
- **React 19**: Component UI library.
- **Zustand**: Client-side state management for persisting drafts and completed
  questionnaires.
- **Zod**: Schema validation for URLs.

### Styling

- **No UI libraries**: All components (buttons, rating groups, radio options,
  cards) are built from scratch.
- **CSS modules**: Component-scoped styling without external UI frameworks. Uses
  modern CSS features including nested selectors, CSS variables, `@media`
  queries, and modern color syntax.
- **Fonts and icons**: Uses custom web fonts, along with Google Material Symbols
  for iconography.

### Testing

The tests are written following Google's best practices. The testing stack
includes:

- **Jest**: Test runner for business logic and store functions.
- **React Testing Library**: Component testing with JSDom and standard
  user-event simulation.

### Tooling, linting & formatting

- **TypeScript**: Strict type checking.
- **ESLint**: Standard linting rules, including `eslint-config-next` and
  `eslint-plugin-simple-import-sort`.
- **Stylelint**: Configured with `stylelint-config-standard` and
  `stylelint-config-clean-order` to enforce CSS standards and handle formatting.
- **Prettier**: Code formatting.
- **Husky & lint-staged**: Pre-commit hooks for linting and formatting.

## Development

Install dependencies:

```bash
npm install
```

Optionally, copy the example environment file:

```bash
cp .env.example .env
```

Start the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## Available scripts

- `npm run dev` - Starts the development server.
- `npm run build` - Builds the application.
- `npm start` - Starts the production server.
- `npm run lint` - Runs ESLint and Stylelint.
- `npm run lint:fix` - Attempts to automatically fix lint issues.
- `npm run format` - Uses Prettier to format supported files.
- `npm run test` - Executes the test suite.
