# Backport verification

Run `yarn test` for the compatibility and integration suites. `yarn check-types`,
`yarn check-lint app src` and `yarn check-formatting` check the production code.

The integration suite hosts the real screens, confirmation control and state
provider. The parser, calculations, commit serialization and rollback are real.
It replaces native camera events, router/focus, SecureStore and Reanimated's native
runtime. The host models modal open/close and retained home focus; it does not
validate Expo Router's native header presentation.

Tests assert visible changes, accessible controls, navigation and saved values.
Gesture cases use Gesture Handler’s official Jest setup and complete-stream
`fireGestureHandler` utility, locating the detector within the accessible
confirmation control. Native state events allow a queued camera callback to be
interleaved during a partial gesture before cancellation. Test renderers cannot
synthesize a real finger drag. Deliberately
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

## Verified on iOS 27

On 23 October 2026, the feature branch was initially run in Expo Go 54.0.6 on
the iPhone 18 Pro simulator with iOS 27.0. After integrating the concurrent main
upgrade, launch and reset confirmation were repeated in Expo Go 57.0.9 with the
native Pan gesture and full-screen modal presentation. The live simulator was
inspected and operated through its browser mirror. Verified:

- Home layout and reset preview in light and dark appearance.
- Reset preview includes a 20-percent battery, ten empty hearts and ten empty
  flames, with the original themed button appearance.
- Reset and scanner present as native modals with visible close buttons.
- An incomplete reset slide stays on the confirmation screen; closing it keeps
  the home values unchanged. A full drag confirms and returns home at 20 percent.
- With camera permission granted, the scanner shows its framing and empty-code
  prompt; dragging its disabled confirmation control does not apply a change.
- Closing the scanner returns home without changing values.

The simulator has no real camera feed. Printed-code recognition, the actual
result animations following a camera scan, and audible VoiceOver delivery still
need a physical-device check. Automated integration tests cover the corresponding
state transitions, announcements and reduced-motion final values.
