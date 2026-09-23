import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

function run(action: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  try {
    void Promise.resolve(action()).catch(() => {});
  } catch {
    // Haptics are optional if the native module is unavailable.
  }
}

export const haptic = {
  tap: () => run(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  confirm: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warn: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => run(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  select: () => run(() => Haptics.selectionAsync()),
};
