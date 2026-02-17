import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlassCard } from '../components/ui/GlassCard';
import { Colors } from '../theme/colors';

export default function OfflineMapsScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.wrap}>
        <Text style={styles.headerLabel}>OFFLINE TOOLING</Text>
        <Text style={styles.headerTitle}>Offline Maps</Text>

        <GlassCard style={styles.card}>
          <Text style={styles.title}>Stubbed in this build</Text>
          <Text style={styles.text}>
            Offline map tiles are not implemented here. When you’re ready:
            {'
'}- pick a map provider and licensing
            {'
'}- implement region downloads + storage management
            {'
'}- add routing + POI layers (optional)
          </Text>
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  wrap: { flex: 1, padding: 16 },
  headerLabel: { color: Colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 8, marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 32, fontWeight: '900', marginBottom: 16 },
  card: { padding: 16 },
  title: { color: Colors.text, fontWeight: '900', marginBottom: 8, fontSize: 16 },
  text: { color: Colors.muted, lineHeight: 20 },
});
