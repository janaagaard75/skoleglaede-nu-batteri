# Backport verification

Run `yarn test` for the compatibility and integration suites. `yarn check-types`,
`yarn check-lint app src` and `yarn check-formatting` check the production code.

The integration suite hosts the real screens, confirmation control and state
provider. The parser, calculations, commit serialization and rollback are real.
It replaces native camera events, router/focus, SecureStore and Reanimated's native
runtime. The host models modal open/close and retained home focus; it does not
validate Expo Router's native header presentation.

Tests assert visible changes, accessible controls, navigation and saved values.
Gesture cases locate the native responder within the accessible confirmation
control because test renderers cannot synthesize a real finger drag. Deliberately
repeated native activation callbacks and queued camera callbacks exercise races
that normal synchronous test event dispatch would hide. Fake timers allow the
400 ms selection lock and final animation values to be checked without frame
snapshots. Reanimated's upstream mock uses the real pure clamp calculation.

## Device/simulator checks

Automated coverage cannot prove native camera selection, gesture recognition or
actual VoiceOver delivery. Before release, verify:

- Camera selection with two printed codes, including signed three-digit
  percentage values outside the reference app's list.
- Starting, cancelling and completing a slide; closing a modal during scanning.
- Scanner and reset headers, close buttons and swipe dismissal on supported
  platforms, including small-screen layouts.
- Battery, heart, flame and score feedback in light and dark mode; overflow above
  100 and battery loss with previously earned hearts.
- Reduced Motion final values and VoiceOver confirmation/result announcements.
- App update/restart retaining existing progress and not repeating old feedback.

Simulator observations are useful for layout and navigation. Camera behavior
still needs a physical device and the actual printed board.
