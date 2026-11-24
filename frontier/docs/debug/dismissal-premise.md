# Dismissal premise under test

Prior premise: author CSS was the remaining fault, and passing fallback/jsdom mouse events proved the SDK gesture contract in native popover mode.

Contradicting observation: parent native Chrome passes desktop outside presses, fails mobile outside taps, and closes/clicks through desktop inside-to-outside drags. Prior tests used MouseEvent without pointerType, omitted the concluding compatibility click, and did not exercise native-popover mode. These are not equivalent gestures. Before another fix, reproduce full mouse/touch sequences against real SDK with native-top-layer capability model and inspect the shipped release versus source. Investigate asset lifetime independently with actual response status/type and build references.

## Result of examining the premise — 2026-11-24, Asia/Shanghai

Canonical sources: https://ui-sdk.dev/docs/solid/components/dialog and https://ui-sdk.dev/docs/solid/popups. Installed release: `@ui-sdk/core` and Solid adapter `0.1.0-beta.16`; registry had no newer version when checked. The official contract explicitly preserves inside-to-outside selection and consumes a modal outside press. Search of current documentation found no supported alternative gesture recipe to justify replacing SDK behavior.

Shipped implementation inspected:
- `foundation/platform/layers.js`: touch down records origin/target; touch click checks movement and dismisses/consumes. Mouse outside down records pending dismissal, outside up executes it and suppresses the compatibility click.
- `foundation/popups/popup.js`: contains/hit testing treats coordinates outside a native panel rectangle as its backdrop; outside action closes with `outside-press`; Backdrop is a manual native popover.
- `foundation/popups/popup-behavior.js`: dialog uses `outsidePress: "click"` and modal shielding.
- `foundation/platform/platform.js`: native popover support selects in-place top-layer rendering instead of the portal fallback.
- `foundation/popups/modal.js`: modal siblings become inert; jsdom cannot reproduce native inert hit rejection.

Six stronger tests pass **before any further gesture behavior change**, including a native-backdrop retarget case. Thus the issue is not reproduced yet. Do not label these a browser regression fix. Parent's screenshot alone cannot establish trusted `pointerType`, native target retargeting, capture, final default prevention or the SDK close reason. Passive opt-in instrumentation now records those facts instead of adding another CSS/gesture guess. It preserves SDK ownership and existing keyboard behavior.

The separate CSS request was actually reproduced as obsolete-hash404, while current HTML emitted D6 rather than requested D4. A two-build/real-preview fixture proves retained old CSS survives and fresh documents are no-store. This is an independently verifiable asset-lifetime correction, not an explanation of native pointer dismissal. BFCache specifically is unproven.

Next decision gate: parent captures one trusted failing mobile tap and one desktop drag trace. Determine which event is absent/retargeted, whether capture changes target, whether SDK sees an outside start and which close reason fires. Only then choose a minimal corrective integration or a precisely reproduced upstream SDK fix; no homemade focus trap.
