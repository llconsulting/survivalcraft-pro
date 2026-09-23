import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { useUser } from '../hooks/useUser';
import { haptic } from '../utils/haptics';
import { GlassCard } from '../components/ui/GlassCard';
import { TrailMark } from '../components/game/TrailMark';

type Nav = { navigate: (name: string, params?: object) => void };

type StartLink = { route: string; params?: object; title: string; body: string; testID: string };

const starts: StartLink[] = [
  {
    route: 'Campaign',
    params: { focusLegId: null },
    title: 'Play The Dry Mile',
    body: 'Open Trail, then Play. Pick a loadout and press Start training. Four decisions, then a debrief.',
    testID: 'home-play',
  },
  {
    route: 'Base',
    title: 'Daily drills',
    body: 'Water, fire, and shelter clear when you walk the matching leg. They do not tick themselves.',
    testID: 'home-drills',
  },
  {
    route: 'Skills',
    title: 'Skills',
    body: 'Start training on a field card. Cards tied to the mile open that leg. The others are a short reading you log yourself.',
    testID: 'home-skills',
  },
];

export default function HomeScreen({ navigation }: { navigation: Nav }) {
  const mileInProgress = useUser((state) => state.activeRun?.status === 'active');
  const cards = starts.map((item) => item.testID === 'home-play' && mileInProgress
    ? { ...item, title: 'Continue The Dry Mile', body: 'A mile is already in progress. Open it and take the next call. Close leaves the run where it is.' }
    : item);
  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <Text style={ui.kicker}>SurvivalCraft</Text>
          <Text style={ui.h1}>A short game about getting home.</Text>
          <Text style={[ui.body, styles.lede]}>
            You get a closed road, a trunk of ordinary gear, and a few calls to make. This Netlify site is that web demo. It is not an App Store product, and nothing here charges a card.
          </Text>
          <TrailMark />

          <Text style={styles.section}>How to start</Text>
          {cards.map((item) => (
            <TouchableOpacity
              key={item.title}
              testID={item.testID}
              activeOpacity={0.85}
              onPress={() => { haptic.tap(); navigation.navigate(item.route, item.params); }}
            >
              <GlassCard style={styles.card} accent={item.route === 'Campaign' ? Colors.green : undefined}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardBody}>{item.body}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}

          <Text style={styles.section}>Free, and the flags</Text>
          <GlassCard style={styles.card}>
            <Text style={styles.cardBody}>
              Free includes The Dry Mile and the basic field cards. Pro and Elite are switches stored on this device. Turning one on does not buy anything. There is no StoreKit and no receipt. Elite also asks you to confirm you are 18 or older. The pages behind it stay educational.
            </Text>
            <Text style={[styles.cardBody, styles.gap]}>
              The medical lesson is a Pro preview. The care decision inside the mile is free either way, and it is not a medical course.
            </Text>
          </GlassCard>

          <Text style={styles.section}>What this site will not do</Text>
          <GlassCard style={styles.card} accent={Colors.orange}>
            <Text style={styles.cardBody}>No GPS, and no map tiles. Notes are notes — there is no camera that names plants, gear, or injuries. The wire is sample copy, not a live feed. A finished mile is practice, not a certification.</Text>
          </GlassCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 12, paddingBottom: 120 },
  lede: { marginTop: 10, marginBottom: 16 },
  section: {
    color: Colors.text,
    fontFamily: serif,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
    marginTop: 6,
  },
  card: { padding: 16, marginBottom: 12 },
  cardTitle: { color: Colors.text, fontFamily: serif, fontSize: 20, fontWeight: '700', marginBottom: 6 },
  cardBody: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 21 },
  gap: { marginTop: 10 },
});
