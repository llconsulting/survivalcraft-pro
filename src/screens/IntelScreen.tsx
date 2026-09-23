import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { intelData } from '../data/intel';
import { Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { GlassCard } from '../components/ui/GlassCard';

const colorFor = (level: 'high' | 'medium' | 'low') => {
  if (level === 'high') return Colors.red;
  if (level === 'medium') return Colors.orange;
  return Colors.green;
};

export default function IntelScreen() {
  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <Text style={ui.kicker}>Static demo</Text>
          <Text style={ui.h1}>Wire</Text>
          <GlassCard style={styles.banner} accent={Colors.red}>
            <Text style={styles.bannerTitle}>Not a live feed</Text>
            <Text style={styles.bannerBody}>
              These lines are sample copy shipped with the app. They are not measured, not sourced from a wire, and not a reason to change a plan.
            </Text>
          </GlassCard>
          {intelData.map((item) => (
            <GlassCard key={item.text} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={[styles.level, { color: colorFor(item.level) }]}>{item.level}</Text>
              </View>
              <Text style={styles.text}>{item.text}</Text>
              <Text style={styles.source}>{item.source ?? 'Static demo'}</Text>
            </GlassCard>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 12, paddingBottom: 120 },
  banner: { padding: 16, marginTop: 12, marginBottom: 14 },
  bannerTitle: { color: Colors.text, fontFamily: serif, fontSize: 22, fontWeight: '700' },
  bannerBody: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 6 },
  card: { padding: 16, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  time: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '700' },
  level: { fontFamily: sans, fontSize: 12, fontWeight: '800', textTransform: 'uppercase' },
  text: { color: Colors.text, fontFamily: sans, fontSize: 15, lineHeight: 21 },
  source: { color: Colors.muted, fontFamily: sans, fontSize: 12, marginTop: 8 },
});
