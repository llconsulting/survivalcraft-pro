import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { GlassCard } from '../components/ui/GlassCard';
import { intelData } from '../data/intel';
import { Colors } from '../theme/colors';

const colorFor = (level: 'high' | 'medium' | 'low') => {
  if (level === 'high') return Colors.red;
  if (level === 'medium') return Colors.orange;
  return Colors.green;
};

export default function IntelScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerLabel}>SITUATIONAL AWARENESS</Text>
          <Text style={styles.headerTitle}>Intel Feed</Text>
        </View>

        <GlassCard style={styles.disclaimer}>
          <Text style={styles.disclaimerTitle}>This is a demo feed</Text>
          <Text style={styles.disclaimerText}>
            When you connect real sources, add provenance, timestamps, and confidence scoring.
          </Text>
        </GlassCard>

        <View style={styles.list}>
          {intelData.map((item, idx) => (
            <GlassCard key={idx} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.time}>{item.time}</Text>
                <View style={[styles.pill, { backgroundColor: `${colorFor(item.level)}22`, borderColor: `${colorFor(item.level)}55` }]}>
                  <Text style={[styles.pillText, { color: colorFor(item.level) }]}>{item.level.toUpperCase()}</Text>
                </View>
              </View>
              <Text style={styles.text}>{item.text}</Text>
              {item.source ? <Text style={styles.source}>Source: {item.source}</Text> : null}
            </GlassCard>
          ))}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  scroll: { flex: 1, padding: 16 },

  header: { marginTop: 8, marginBottom: 16 },
  headerLabel: { color: Colors.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 4 },
  headerTitle: { color: Colors.text, fontSize: 32, fontWeight: '900' },

  disclaimer: { padding: 14, marginBottom: 16 },
  disclaimerTitle: { color: Colors.text, fontSize: 15, fontWeight: '900', marginBottom: 6 },
  disclaimerText: { color: Colors.muted, fontSize: 13, lineHeight: 18 },

  list: { gap: 12 },
  card: { padding: 16, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  time: { color: Colors.muted, fontSize: 12, fontWeight: '800' },
  pill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, borderWidth: 1 },
  pillText: { fontSize: 11, fontWeight: '900', letterSpacing: 0.6 },

  text: { color: Colors.text, fontSize: 14, lineHeight: 20 },
  source: { color: Colors.muted, fontSize: 11, marginTop: 10 },
});
