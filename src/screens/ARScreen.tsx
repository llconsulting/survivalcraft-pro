import React, { useState } from 'react';
import { Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../theme/colors';
import { sans, serif, ui } from '../theme/type';
import { useUser } from '../hooks/useUser';
import { haptic } from '../utils/haptics';
import { GlassCard } from '../components/ui/GlassCard';
import { Viewfinder } from '../components/scan/Viewfinder';

const TIPS = [
  'Water container you would actually drink from.',
  'A layer that still works if it gets damp.',
  'A light you can use without holding the phone.',
];

export default function ARScreen() {
  const addFieldNote = useUser((state) => state.addFieldNote);
  const notes = useUser((state) => state.fieldNotes);
  const [draft, setDraft] = useState('');
  const isWeb = Platform.OS === 'web';

  const save = () => {
    if (!draft.trim()) {
      haptic.warn();
      return;
    }
    addFieldNote(draft);
    haptic.confirm();
    setDraft('');
  };

  return (
    <SafeAreaView style={ui.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={ui.frame}>
          <Text style={ui.kicker}>Field notes</Text>
          <Text style={ui.h1}>No scanner</Text>
          <Text style={[ui.body, styles.lede]}>
            {isWeb
              ? 'This web preview does not open a camera. Nothing here identifies plants, gear, injuries, or threats.'
              : 'There is no identification model in this build. The viewfinder, if you open it, will not name what it sees.'}
          </Text>

          <Viewfinder />

          <GlassCard style={styles.card} accent={Colors.orange}>
            <Text style={styles.cardTitle}>If you are checking a kit</Text>
            <Text style={styles.cardBody}>Write the three things that would hurt to be missing. The app will not invent them.</Text>
            {TIPS.map((tip) => (
              <Text key={tip} style={styles.tip}>· {tip}</Text>
            ))}
          </GlassCard>

          <Text style={styles.label}>Note</Text>
          <TextInput
            testID="note-input"
            value={draft}
            onChangeText={setDraft}
            placeholder="What is actually in front of you?"
            placeholderTextColor={Colors.muted}
            style={styles.input}
            multiline
            maxLength={280}
          />
          <TouchableOpacity testID="save-note" style={ui.primary} onPress={save}>
            <Text style={ui.primaryText}>Save note</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Saved on this device</Text>
          {notes.length === 0 ? (
            <GlassCard style={styles.empty}>
              <Text style={styles.cardTitle}>No notes yet</Text>
              <Text style={styles.cardBody}>An empty list is honest. A fake scan result would not be.</Text>
            </GlassCard>
          ) : (
            notes.map((note) => (
              <GlassCard key={note.id} style={styles.note}>
                <Text style={styles.noteDate}>{note.createdOn}</Text>
                <Text style={styles.noteText}>{note.text}</Text>
              </GlassCard>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scroll: { paddingTop: 12, paddingBottom: 120 },
  lede: { marginTop: 10, marginBottom: 16 },
  card: { padding: 16, marginBottom: 16 },
  cardTitle: { color: Colors.text, fontFamily: serif, fontSize: 20, fontWeight: '700' },
  cardBody: { color: Colors.muted, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 6 },
  tip: { color: Colors.text, fontFamily: sans, fontSize: 14, lineHeight: 20, marginTop: 8 },
  label: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8, marginTop: 8 },
  input: {
    minHeight: 88,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    color: Colors.text,
    fontFamily: sans,
    fontSize: 15,
    padding: 12,
    marginBottom: 12,
    textAlignVertical: 'top',
  },
  empty: { padding: 16, marginTop: 4 },
  note: { padding: 14, marginBottom: 10 },
  noteDate: { color: Colors.orange, fontFamily: sans, fontSize: 11, fontWeight: '800' },
  noteText: { color: Colors.text, fontFamily: sans, fontSize: 15, lineHeight: 21, marginTop: 6 },
});
