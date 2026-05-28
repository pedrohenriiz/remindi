import { useRef, useEffect } from 'react';
import { Animated, PanResponder } from 'react-native';

const ANIMATION_DURATION = 280;
const SHEET_TRANSLATE_Y = 400;
const CLOSE_THRESHOLD = 80;

export function useSheetAnimation(visible: boolean) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SHEET_TRANSLATE_Y)).current;

  const animateIn = () =>
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start();

  const animateOut = (callback?: () => void) =>
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SHEET_TRANSLATE_Y,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }),
    ]).start(callback);

  useEffect(() => {
    if (visible) {
      sheetTranslateY.setValue(SHEET_TRANSLATE_Y);
      backdropOpacity.setValue(0);
      animateIn();
    }
  }, [visible]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, g) => g.dy > 0,
      onPanResponderMove: (_, g) => {
        if (g.dy > 0) {
          sheetTranslateY.setValue(g.dy);
          backdropOpacity.setValue(Math.max(0, 1 - g.dy / SHEET_TRANSLATE_Y));
        }
      },
      onPanResponderRelease: (_, g) => {
        if (g.dy > CLOSE_THRESHOLD) {
          animateOut();
        } else {
          Animated.parallel([
            Animated.timing(backdropOpacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(sheetTranslateY, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
        }
      },
    }),
  ).current;

  return {
    backdropOpacity,
    sheetTranslateY,
    panResponder,
    animateIn,
    animateOut,
  };
}
