import { Platform } from 'react-native';
import * as Haptics from 'expo-haptics';

function fire(fn: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  fn().catch(() => undefined);
}

export const haptic = {
  tap: () => fire(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)),
  confirm: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)),
  warn: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)),
  error: () => fire(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)),
  select: () => fire(() => Haptics.selectionAsync()),
};
