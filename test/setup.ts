import "react-native-gesture-handler/jestSetup";
import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
jest.mock("react-native-worklets", () =>
  jest.requireActual("react-native-worklets/src/mock"),
);
jest.mock("react-native-reanimated", () => ({
  ...jest.requireActual("react-native-reanimated/mock"),
  // Reanimated's upstream mock leaves clamp as a no-op. Use its real pure math.
  clamp: jest.requireActual("react-native-reanimated/src/interpolation").clamp,
  useReducedMotion: jest.fn(() => false),
  // Native shared values keep their identity across renders. The upstream mock
  // creates a new object on every call, which spuriously runs effect cleanups.
  useSharedValue: <Value>(initial: Value) => {
    const React = jest.requireActual<typeof import("react")>("react");
    const [shared] = React.useState(() =>
      jest
        .requireActual("react-native-reanimated/mock")
        .useSharedValue(initial),
    );
    return shared;
  },
}));
