import mockSafeAreaContext from "react-native-safe-area-context/jest/mock";

jest.mock("react-native-safe-area-context", () => mockSafeAreaContext);
jest.mock("react-native-reanimated", () => ({
  ...jest.requireActual("react-native-reanimated/mock"),
  // Reanimated's upstream mock leaves clamp as a no-op. Use its real pure math.
  clamp: jest.requireActual("react-native-reanimated/src/interpolation").clamp,
  useReducedMotion: jest.fn(() => false),
}));
