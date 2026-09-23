import { Platform, StyleSheet } from 'react-native';
import { Colors } from './colors';

export const serif = Platform.select({
  web: 'Georgia, "Iowan Old Style", Palatino, "Palatino Linotype", serif',
  ios: 'Georgia',
  default: 'serif',
}) as string;

export const sans = Platform.select({
  web: '"Avenir Next", "Segoe UI", sans-serif',
  ios: 'Avenir Next',
  default: 'sans-serif',
}) as string;

export const ui = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.bg },
  frame: { width: '100%', maxWidth: 760, alignSelf: 'center', paddingHorizontal: 16 },
  kicker: {
    fontFamily: sans,
    color: Colors.orange,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  h1: {
    fontFamily: serif,
    color: Colors.text,
    fontSize: 36,
    lineHeight: 40,
    fontWeight: '700',
  },
  h2: {
    fontFamily: serif,
    color: Colors.text,
    fontSize: 28,
    lineHeight: 32,
    fontWeight: '700',
  },
  body: {
    fontFamily: sans,
    color: Colors.text,
    fontSize: 16,
    lineHeight: 23,
  },
  muted: {
    fontFamily: sans,
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  primary: {
    backgroundColor: Colors.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryText: {
    fontFamily: sans,
    color: Colors.bg,
    fontSize: 16,
    fontWeight: '800',
  },
  ghost: {
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  ghostText: {
    fontFamily: sans,
    color: Colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
});
