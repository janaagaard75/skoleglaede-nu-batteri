import {
  fireEvent,
  render,
  screen,
  act,
  cleanup,
  within,
} from "@testing-library/react-native";
import { BarcodeScanningResult } from "expo-camera";
import { setItemAsync } from "expo-secure-store";
import { useState } from "react";
import {
  AccessibilityInfo,
  DeviceEventEmitter,
  Pressable,
  Text,
  View,
} from "react-native";
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  State,
} from "react-native-gesture-handler";
import { fireGestureHandler } from "react-native-gesture-handler/jest-utils";
import { useReducedMotion } from "react-native-reanimated";
import { HomeScreen } from "../src/homeScreen/HomeScreen";
import { MainStateProvider } from "../src/mainState/MainStateProvider";
import { ResetScreen } from "../src/ResetScreen";
import { ScannerScreen } from "../src/scannerScreen/ScannerScreen";

type Route = "/" | "/scan" | "/reset";
const mockStorage = new Map<string, string>();
let mockRoute: Route = "/";
let mockCanGoBack = true;
let mockNavigate: (route: Route) => void;

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn(async (key: string) => mockStorage.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockStorage.set(key, value);
  }),
}));

jest.mock("expo-camera", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const Native =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    useCameraPermissions: () => [{ granted: true }, jest.fn()],
    CameraView: (props: object) =>
      React.createElement(Native.View, { ...props, testID: "camera" }),
  };
});

jest.mock("expo-router", () => {
  const React = jest.requireActual<typeof import("react")>("react");
  const Native =
    jest.requireActual<typeof import("react-native")>("react-native");
  return {
    useIsFocused: () => mockRoute === "/",
    useRouter: () => ({
      canGoBack: () => mockCanGoBack && mockRoute !== "/",
      back: () => mockNavigate("/"),
      replace: (route: Route) => mockNavigate(route),
    }),
    Link: (props: { children: React.ReactNode; href: Route }) =>
      React.createElement(
        Native.Pressable,
        { onPress: () => mockNavigate(props.href) },
        props.children,
      ),
  };
});

// Router and native camera/storage are the outer boundaries. All screens, the
// confirmation control, parsing, calculations and persistence orchestration are real.
const AppHost = ({ initialRoute = "/" }: { initialRoute?: Route }) => {
  const [route, setRoute] = useState<Route>(initialRoute);
  mockRoute = route;
  mockNavigate = setRoute;
  return (
    <GestureHandlerRootView>
      <MainStateProvider>
        <View style={{ display: route === "/" ? "flex" : "none" }}>
          <HomeScreen />
        </View>
        {route !== "/" && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Luk"
            onPress={() => setRoute("/")}
          >
            <Text>Luk</Text>
          </Pressable>
        )}
        {route === "/scan" && <ScannerScreen />}
        {route === "/reset" && <ResetScreen />}
      </MainStateProvider>
    </GestureHandlerRootView>
  );
};

const flush = async () => {
  await act(async () => {
    // Promise jobs include hydration, the serialized commit and storage rollback.
    for (let index = 0; index < 12; index += 1) {
      await Promise.resolve();
    }
  });
};

const finishFeedback = async () => {
  await flush();
  await act(async () => {
    jest.advanceTimersByTime(2_000);
  });
  await flush();
};

const seed = (percentage = 20, hearts = 0, flames = 0) => {
  mockStorage.set("percentage", percentage.toString());
  mockStorage.set("hearts", hearts.toString());
  mockStorage.set("flames", flames.toString());
};

const mount = async (initialRoute: Route = "/") => {
  const result = render(<AppHost initialRoute={initialRoute} />);
  await flush();
  return result;
};

const scan = (data: string, x = 70) => {
  const event: BarcodeScanningResult = {
    data: data,
    type: "qr",
    bounds: { origin: { x: x, y: 70 }, size: { width: 50, height: 50 } },
    cornerPoints: [],
  };
  fireEvent(screen.getByTestId("camera"), "barcodeScanned", event);
};

const confirm = () =>
  fireEvent(
    screen.getByRole("button", { name: "Bekræft" }),
    "accessibilityAction",
    { nativeEvent: { actionName: "activate" } },
  );

const confirmationPan = (): ReturnType<typeof Gesture.Pan> =>
  within(screen.getByRole("button", { name: "Bekræft" })).UNSAFE_getByType(
    GestureDetector,
  ).props.gesture;

const slide = (translationX: number) => {
  act(() => {
    fireGestureHandler(confirmationPan(), [
      { state: State.BEGAN, translationX: 0 },
      { state: State.ACTIVE, translationX: 0 },
      { state: State.ACTIVE, translationX: translationX },
      { state: State.END, translationX: translationX },
    ]);
    jest.runAllTicks();
  });
};

// The official helper completes whole gesture streams. Native event emission
// lets this test interleave a queued camera callback before cancellation.
const nativePanState = (
  pan: ReturnType<typeof Gesture.Pan>,
  oldState: number,
  state: number,
  translationX = 0,
) => {
  act(() => {
    DeviceEventEmitter.emit("onGestureHandlerStateChange", {
      handlerTag: pan.handlerTag,
      oldState: oldState,
      state: state,
      translationX: translationX,
      translationY: 0,
      numberOfPointers: 1,
    });
    jest.runAllTicks();
  });
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
  mockStorage.clear();
  mockCanGoBack = true;
  seed();
  jest.mocked(useReducedMotion).mockReturnValue(true);
  jest
    .spyOn(AccessibilityInfo, "announceForAccessibility")
    .mockImplementation(() => undefined);
});

afterEach(() => {
  cleanup();
  jest.clearAllTimers();
  jest.useRealTimers();
  jest.restoreAllMocks();
});

test("hydrates legacy progress and displays a large score with spaces", async () => {
  seed(20, 10, 10);
  await mount();
  expect(screen.getByText("1 520")).toBeOnTheScreen();
  expect(screen.getByLabelText("10 hjerter")).toBeOnTheScreen();
  expect(screen.getByLabelText("10 flammer")).toBeOnTheScreen();
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
});

test.each([
  ["+005pp", "+ 5%", 25, 0, 0],
  ["-015pp", "− 15%", 5, 0, 0],
  ["+025pp", "+ 25%", 45, 0, 0],
  ["+040pp", "+ 40%", 60, 0, 0],
  ["+100pp", "+ 100%", 20, 1, 0],
  ["+heart", "+ 1 hjerte", 20, 1, 0],
  ["-heart", "− 1 hjerte", 20, 0, 0],
  ["+flame", "+ 1 flamme", 20, 0, 1],
  ["-flame", "− 1 flamme", 20, 0, 0],
])(
  "scans and confirms the printed code %s through the real app",
  async (code, label, percentage, hearts, flames) => {
    await mount();
    fireEvent.press(screen.getByText("Scan QR-kode"));
    scan(String(code));
    expect(screen.getByText(String(label))).toBeOnTheScreen();
    expect(mockStorage.get("percentage")).toBe("20");
    expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
    confirm();
    await finishFeedback();
    expect(
      screen.getByLabelText(`Batteri ${percentage} procent`),
    ).toBeOnTheScreen();
    expect(screen.getByLabelText(`${hearts} hjerter`)).toBeOnTheScreen();
    expect(screen.getByLabelText(`${flames} flammer`)).toBeOnTheScreen();
    expect(mockStorage.get("percentage")).toBe(String(percentage));
    expect(mockStorage.get("hearts")).toBe(String(hearts));
    expect(mockStorage.get("flames")).toBe(String(flames));
    expect(jest.mocked(setItemAsync)).toHaveBeenCalledTimes(3);
  },
);

test("unknown codes are distinct from no code and cannot be confirmed", async () => {
  await mount();
  fireEvent.press(screen.getByText("Scan QR-kode"));
  expect(screen.getByText("Scan en QR-kode")).toBeOnTheScreen();
  scan("https://unrelated.example");
  expect(screen.getByText("Ukendt QR-kode")).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: "Bekræft" })).toBeDisabled();
  confirm();
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
  fireEvent.press(screen.getByRole("button", { name: "Luk" }));
  expect(screen.getByLabelText("Batteri 20 procent")).toBeOnTheScreen();
});

test("locks selection during a gesture and termination never applies a change", async () => {
  await mount();
  fireEvent.press(screen.getByText("Scan QR-kode"));
  scan("+025pp");
  const queuedCameraCallback =
    screen.getByTestId("camera").props.onBarcodeScanned;
  const pan = confirmationPan();
  nativePanState(pan, State.UNDETERMINED, State.BEGAN);
  // Native camera events can already be queued before the handler is detached.
  act(() =>
    queuedCameraCallback({
      data: "-020pp",
      bounds: { origin: { x: 70, y: 70 }, size: { width: 50, height: 50 } },
    }),
  );
  expect(screen.getByText("+ 25%")).toBeOnTheScreen();
  nativePanState(pan, State.BEGAN, State.ACTIVE);
  nativePanState(pan, State.ACTIVE, State.CANCELLED, 200);
  await flush();
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
  expect(screen.getByText("+ 25%")).toBeOnTheScreen();
  slide(110);
  await finishFeedback();
  expect(screen.getByLabelText("Batteri 45 procent")).toBeOnTheScreen();
});

test("a short slide cancels and a challenger must displace the selected code for 400 ms", async () => {
  await mount();
  fireEvent.press(screen.getByText("Scan QR-kode"));
  scan("+005pp");
  slide(30);
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
  scan("+040pp");
  await act(async () => {
    jest.advanceTimersByTime(200);
  });
  scan("+005pp");
  scan("+040pp");
  expect(screen.getByText("+ 5%")).toBeOnTheScreen();
  await act(async () => {
    jest.advanceTimersByTime(200);
  });
  scan("+040pp");
  expect(screen.getByText("+ 5%")).toBeOnTheScreen();
  await act(async () => {
    jest.advanceTimersByTime(201);
  });
  scan("+040pp");
  expect(screen.getByText("+ 40%")).toBeOnTheScreen();
  fireEvent.press(screen.getByRole("button", { name: "Luk" }));
  await act(async () => {
    jest.advanceTimersByTime(5_000);
  });
  expect(screen.getByLabelText("Batteri 20 procent")).toBeOnTheScreen();
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
});

test("waits for persistence and registers repeated confirmation events only once", async () => {
  let releaseWrite: (() => void) | undefined;
  const blockedWrite = new Promise<void>(resolve => {
    releaseWrite = resolve;
  });
  jest.mocked(setItemAsync).mockImplementationOnce(async (key, value) => {
    await blockedWrite;
    mockStorage.set(key, value);
  });
  await mount();
  fireEvent.press(screen.getByText("Scan QR-kode"));
  scan("+025pp");
  const activation = screen.getByRole("button", { name: "Bekræft" }).props
    .onAccessibilityAction;
  act(() => {
    activation({ nativeEvent: { actionName: "activate" } });
    activation({ nativeEvent: { actionName: "activate" } });
  });
  await flush();
  expect(screen.getByText("+ 25%")).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: "Bekræft" })).toBeDisabled();
  expect(jest.mocked(setItemAsync)).toHaveBeenCalledTimes(3);
  await act(async () => {
    releaseWrite?.();
  });
  await finishFeedback();
  expect(screen.getByLabelText("Batteri 45 procent")).toBeOnTheScreen();
  expect(jest.mocked(setItemAsync)).toHaveBeenCalledTimes(3);
});

test("failed persistence rolls back progress, stays in scanner and permits retry", async () => {
  seed(80, 2, 1);
  await mount();
  fireEvent.press(screen.getByText("Scan QR-kode"));
  scan("+025pp");
  jest
    .mocked(setItemAsync)
    .mockRejectedValueOnce(new Error("disk unavailable"));
  confirm();
  await flush();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Ændringen kunne ikke gemmes. Prøv igen.",
  );
  expect(screen.getByRole("button", { name: "Bekræft" })).toBeEnabled();
  expect(Object.fromEntries(mockStorage)).toEqual({
    percentage: "80",
    hearts: "2",
    flames: "1",
  });
  confirm();
  await finishFeedback();
  expect(screen.getByLabelText("Batteri 5 procent")).toBeOnTheScreen();
  expect(screen.getByLabelText("3 hjerter")).toBeOnTheScreen();
});

test("closing scanner and reset preserves progress; confirming reset saves initial values once", async () => {
  seed(80, 2, 1);
  await mount();
  fireEvent.press(screen.getByText("Scan QR-kode"));
  scan("+heart");
  fireEvent.press(screen.getByRole("button", { name: "Luk" }));
  fireEvent.press(screen.getByText("Nulstil"));
  fireEvent.press(screen.getByRole("button", { name: "Luk" }));
  expect(screen.getByLabelText("Batteri 80 procent")).toBeOnTheScreen();
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
  fireEvent.press(screen.getByText("Nulstil"));
  const activation = screen.getByRole("button", { name: "Bekræft" }).props
    .onAccessibilityTap;
  act(() => {
    activation();
    activation();
  });
  await flush();
  expect(screen.getByLabelText("Batteri 20 procent")).toBeOnTheScreen();
  expect(screen.getByLabelText("0 hjerter")).toBeOnTheScreen();
  expect(screen.getByLabelText("0 flammer")).toBeOnTheScreen();
  expect(jest.mocked(setItemAsync)).toHaveBeenCalledTimes(3);
});

test.each([true, false])(
  "explains one committed result, reaches final state and never replays on reopen/restart (reduced motion %s)",
  async reducedMotion => {
    jest.mocked(useReducedMotion).mockReturnValue(reducedMotion);
    const result = await mount();
    fireEvent.press(screen.getByText("Scan QR-kode"));
    scan("+heart");
    confirm();
    await finishFeedback();
    expect(screen.getByLabelText("1 hjerter")).toBeOnTheScreen();
    expect(screen.getByLabelText("Trivselsscore 120")).toBeOnTheScreen();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByText("Scan QR-kode"));
    fireEvent.press(screen.getByRole("button", { name: "Luk" }));
    await finishFeedback();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
    result.unmount();
    await mount();
    await finishFeedback();
    expect(screen.getByLabelText("Trivselsscore 120")).toBeOnTheScreen();
    expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
  },
);

test.each([
  { starting: 80, code: "+020pp", expected: 100, hearts: 2 },
  { starting: 80, code: "+025pp", expected: 5, hearts: 3 },
  { starting: 10, code: "-020pp", expected: 0, hearts: 2 },
])(
  "preserves the existing battery/heart rule for $starting with $code",
  async scenario => {
    seed(scenario.starting, 2, 1);
    await mount();
    fireEvent.press(screen.getByText("Scan QR-kode"));
    scan(scenario.code);
    confirm();
    await finishFeedback();
    expect(
      screen.getByLabelText(`Batteri ${scenario.expected} procent`),
    ).toBeOnTheScreen();
    expect(
      screen.getByLabelText(`${scenario.hearts} hjerter`),
    ).toBeOnTheScreen();
    expect(mockStorage.get("percentage")).toBe(scenario.expected.toString());
    expect(mockStorage.get("hearts")).toBe(scenario.hearts.toString());
  },
);

test("reset remains open until persistence completes and permits retry after failure", async () => {
  seed(80, 2, 1);
  await mount();
  fireEvent.press(screen.getByText("Nulstil"));
  let failWrite: ((reason: Error) => void) | undefined;
  const blockedWrite = new Promise<void>((_resolve, reject) => {
    failWrite = reject;
  });
  jest.mocked(setItemAsync).mockImplementationOnce(async () => blockedWrite);
  confirm();
  await flush();
  expect(screen.getByText(/Bekræft at du vil nulstille/)).toBeOnTheScreen();
  expect(screen.getByRole("button", { name: "Bekræft" })).toBeDisabled();
  await act(async () => {
    failWrite?.(new Error("disk unavailable"));
  });
  await flush();
  expect(screen.getByRole("alert")).toHaveTextContent(
    "Nulstillingen kunne ikke gemmes. Prøv igen.",
  );
  expect(screen.getByRole("button", { name: "Bekræft" })).toBeEnabled();
  expect(Object.fromEntries(mockStorage)).toEqual({
    percentage: "80",
    hearts: "2",
    flames: "1",
  });
  confirm();
  await flush();
  expect(screen.getByLabelText("Batteri 20 procent")).toBeOnTheScreen();
  expect(Object.fromEntries(mockStorage)).toEqual({
    percentage: "20",
    hearts: "0",
    flames: "0",
  });
});

test("a directly opened scanner replaces its route with home after confirmation", async () => {
  mockCanGoBack = false;
  await mount("/scan");
  scan("+025pp");
  confirm();
  await finishFeedback();
  expect(screen.queryByTestId("camera")).toBeNull();
  expect(screen.getByLabelText("Batteri 45 procent")).toBeOnTheScreen();
  expect(mockStorage.get("percentage")).toBe("45");
  expect(AccessibilityInfo.announceForAccessibility).toHaveBeenCalledTimes(1);
});

test("reset previews empty hearts and flames without changing earned progress", async () => {
  seed(80, 2, 3);
  await mount();
  fireEvent.press(screen.getByText("Nulstil"));
  expect(screen.getByLabelText("0 hjerter")).toBeOnTheScreen();
  expect(screen.getByLabelText("0 flammer")).toBeOnTheScreen();
  expect(jest.mocked(setItemAsync)).not.toHaveBeenCalled();
  expect(Object.fromEntries(mockStorage)).toEqual({
    percentage: "80",
    hearts: "2",
    flames: "3",
  });
  fireEvent.press(screen.getByRole("button", { name: "Luk" }));
  expect(screen.getByLabelText("2 hjerter")).toBeOnTheScreen();
  expect(screen.getByLabelText("3 flammer")).toBeOnTheScreen();
});
