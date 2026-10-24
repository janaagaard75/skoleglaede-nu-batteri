# Coding standards

## Scope and sources of truth

These standards apply to application code in `app/` and `src/`. The QR-code
generator has its own package; use its configuration when changing that tool.
Use the repository's ESLint, Prettier and TypeScript configurations as the
authority for mechanical rules. Keep changes focused on the requested behavior.

## TypeScript and React

- Use explicit domain types and narrow external input before using it. Prefer
  `type` aliases and `Array<T>` or `ReadonlyArray<T>` for array types.
- Use explicit boolean conditions and exhaustive handling of domain variants.
  Preserve type safety rather than suppressing diagnostics or introducing `any`.
- Use arrow functions and named exports in application modules. Match the file
  name to its named export. Expo Router route modules use default exports.
- Keep route modules small and implement screens and reusable behavior in `src/`.
- Follow the Rules of Hooks and include effect dependencies. Release timers,
  subscriptions and other resources when their owning component stops using them.
- Use explicit object properties, such as `{ score: score }`, rather than property
  shorthand. Use braces for conditional bodies and strict equality comparisons.
- Add memoization when it serves a demonstrated need; keep ordinary calculations
  and data flow straightforward.

## State and side effects

- Keep QR parsing and game calculations separate from rendering, navigation and
  persistence. Reuse the existing main-state boundary for applying game changes.
- Validate scanned input before changing state. A user confirmation must apply
  its selected change once, including when events arrive repeatedly.
- Treat persisted progress and printed QR codes as compatibility contracts.
  Changes to storage keys, accepted codes or game rules require an explicit
  decision and, where needed, a migration plan.
- Await persistence where completion matters. Make error handling and ownership
  of asynchronous work explicit so callers can distinguish success from failure.

## Interface and accessibility

- Reuse themed components and shared color definitions. Preserve Skoleglæde's
  battery, hearts, flames and button design unless a requested change replaces
  them. Keep user-facing text in Danish.
- Give interactive elements meaningful accessibility labels, roles and states.
  Confirmation controls must also work with a screen reader.
- Respect reduced-motion settings. Animation must communicate a state change
  while leaving the final values understandable without motion.
- Check changed layouts in light and dark mode. Put platform-specific components
  in the platform-specific files expected by the React Native lint rules.

## Verification

- Test observable behavior at the highest practical existing boundary. Prefer
  realistic user flows over assertions about private state or component structure.
- Cover regressions that matter: QR compatibility, one change per confirmation,
  score boundaries, cancellation and preservation of saved progress when affected.
- Use device or simulator checks for camera behavior, gestures, animations and
  screen-reader interaction that automated tests cannot faithfully exercise.
- Run the applicable type, lint and formatting checks defined in `package.json`
  and the validation workflow. Lint warnings fail validation. Report checks that
  could not run and their concrete blockers.
- Keep automated tests runnable through the declared test command and the
  validation workflow. Use the existing integration and compatibility suites
  as references when adding regression coverage.

## Comments and documentation

Use English for code identifiers and technical documentation. Explain decisions,
compatibility constraints and non-obvious behavior in comments. Keep diagnostic
logging out of committed application code. Update relevant documentation when a
change alters a documented contract.
