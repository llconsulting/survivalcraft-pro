import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { sans, ui } from '../theme/type';
import { GlassCard } from '../components/ui/GlassCard';

export default function OfflineMapsScreen() {
  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <View style={[ui.frame, styles.wrap]}>
        <Text style={ui.kicker}>Not in this build</Text>
        <Text style={ui.h1}>Maps</Text>
        <GlassCard style={styles.card}>
          <Text style={styles.title}>No tiles, no GPS</Text>
          <Text style={styles.body}>
            The Dry Mile uses a drawn route. This screen does not download maps, track a position, or route you anywhere.
          </Text>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingTop: 12 },
  card: { padding: 16, marginTop: 16 },
  title: { color: Colors.text, fontFamily: sans, fontSize: 18, fontWeight: '800', marginBottom: 8 },
  body: { color: Colors.muted, fontFamily: sans, fontSize: 15, lineHeight: 22 },
});
