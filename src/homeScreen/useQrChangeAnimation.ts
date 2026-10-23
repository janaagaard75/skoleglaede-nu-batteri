/* eslint-disable react-hooks-extra/no-direct-set-state-in-use-effect -- Navigation and committed game state drive this cancellable presentation animation. */
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import { AccessibilityInfo, AppState, InteractionManager } from "react-native";
import { useReducedMotion } from "react-native-reanimated";
import { MainValues } from "../mainState/MainValues";
import { scoreForValues } from "../mainState/scoreForValues";
import { useMainState } from "../mainState/useMainState";

export const useQrChangeAnimation = () => {
  const { flames, hearts, pendingQrChange, percentage, takePendingQrChange } =
    useMainState();
  const isFocused = useIsFocused();
  const reduceMotion = useReducedMotion();
  const [appState, setAppState] = useState(AppState.currentState);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayedValues, setDisplayedValues] = useState<MainValues>({
    flames: flames,
    hearts: hearts,
    percentage: percentage,
  });
  const [displayedScore, setDisplayedScore] = useState(() =>
    scoreForValues(displayedValues),
  );
  const frameRef = useRef<number | undefined>(undefined);
  const runningRef = useRef(false);
  const latestRef = useRef(displayedValues);
  latestRef.current = {
    flames: flames,
    hearts: hearts,
    percentage: percentage,
  };

  useEffect(() => {
    const cancelAndSync = () => {
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
      runningRef.current = false;
      setIsAnimating(false);
      setDisplayedValues(latestRef.current);
      setDisplayedScore(scoreForValues(latestRef.current));
    };
    if (!isFocused) {
      cancelAndSync();
    }
    const subscription = AppState.addEventListener("change", state => {
      setAppState(state);
      if (state !== "active") {
        cancelAndSync();
      }
    });
    return () => {
      subscription.remove();
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
      runningRef.current = false;
    };
  }, [isFocused]);

  useEffect(() => {
    if (
      !isFocused
      || appState === "background"
      || appState === "inactive"
      || pendingQrChange === undefined
    ) {
      if (!runningRef.current && pendingQrChange === undefined) {
        setDisplayedValues(latestRef.current);
        setDisplayedScore(scoreForValues(latestRef.current));
      }
      return;
    }
    // Wait until the modal has closed before explaining its result.
    // eslint-disable-next-line @typescript-eslint/no-deprecated -- Navigation completion, rather than idle time, is required here.
    const task = InteractionManager.runAfterInteractions(() => {
      const change = takePendingQrChange();
      if (change === undefined) {
        return;
      }
      const result = change.newValues;
      AccessibilityInfo.announceForAccessibility(
        `Resultat: Batteri ${result.percentage} procent, ${result.hearts} hjerter og ${result.flames} flammer. Trivselsscore ${scoreForValues(result)}.`,
      );
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
      if (reduceMotion) {
        runningRef.current = false;
        setDisplayedValues(result);
        setDisplayedScore(scoreForValues(result));
        return;
      }
      runningRef.current = true;
      setIsAnimating(true);
      setDisplayedValues(change.previousValues);
      setDisplayedScore(scoreForValues(change.previousValues));
      let startedAt: number | undefined;
      const update = (now: number) => {
        startedAt ??= now;
        const progress = Math.min(1, (now - startedAt) / 1100);
        const eased = progress * progress * (3 - 2 * progress);
        const previous = change.previousValues;
        // Explain the existing overflow rule without recalculating the game result.
        const earnsHeart =
          change.qrCode.type === "percentage"
          && result.hearts > previous.hearts;
        const percentageProgress = earnsHeart
          ? Math.max(0, (eased - 0.5) * 2)
          : eased;
        const fromPercentage =
          earnsHeart && eased >= 0.5 ? 0 : previous.percentage;
        const toPercentage =
          earnsHeart && eased < 0.5 ? 100 : result.percentage;
        const batteryProgress =
          earnsHeart && eased < 0.5 ? eased * 2 : percentageProgress;
        setDisplayedValues({
          flames: eased < 0.5 ? previous.flames : result.flames,
          hearts: eased < 0.5 ? previous.hearts : result.hearts,
          percentage: Math.round(
            fromPercentage + (toPercentage - fromPercentage) * batteryProgress,
          ),
        });
        setDisplayedScore(
          Math.round(
            scoreForValues(previous)
              + (scoreForValues(result) - scoreForValues(previous)) * eased,
          ),
        );
        if (progress < 1) {
          frameRef.current = requestAnimationFrame(update);
        } else {
          runningRef.current = false;
          setIsAnimating(false);
          frameRef.current = undefined;
          setDisplayedValues(result);
          setDisplayedScore(scoreForValues(result));
        }
      };
      frameRef.current = requestAnimationFrame(update);
    });
    return () => {
      task.cancel();
    };
  }, [
    appState,
    flames,
    hearts,
    isFocused,
    pendingQrChange,
    percentage,
    reduceMotion,
    takePendingQrChange,
  ]);

  // A modal can publish its result before focus returns; keep the old values until
  // the animation starts rather than briefly flashing the final state underneath.
  return {
    displayedScore:
      pendingQrChange === undefined
        ? displayedScore
        : scoreForValues(pendingQrChange.previousValues),
    displayedValues:
      pendingQrChange === undefined
        ? displayedValues
        : pendingQrChange.previousValues,
    isAnimating: isAnimating,
  };
};
