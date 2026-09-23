import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CAMPAIGN_LEGS } from '../../game/campaign';
import { RunStatus } from '../../game/types';
import { Colors } from '../../theme/colors';
import { sans } from '../../theme/type';

interface Props {
  legIndex: number;
  status: RunStatus | 'setup';
}

export const RouteTrack: React.FC<Props> = ({ legIndex, status }) => {
  const last = CAMPAIGN_LEGS.length - 1;
  return (
    <View style={styles.row}>
      {CAMPAIGN_LEGS.map((leg, index) => {
        const done = status === 'complete' || (status !== 'setup' && index < legIndex);
        const current = status === 'active' && index === legIndex;
        const failed = status === 'turned-back' && index === legIndex;
        const lineBefore = index > 0 && (done || current || failed);
        const lineAfter = index < last && done;
        return (
          <View key={leg.id} style={styles.cell}>
            <View style={styles.nodeRow}>
              <View style={[styles.line, index === 0 && styles.lineHidden, lineBefore && styles.lineOn]} />
              <View style={[styles.node, done && styles.nodeDone, current && styles.nodeCurrent, failed && styles.nodeFailed]}>
                <Text style={[styles.index, done && styles.indexOn, current && styles.indexCurrent, failed && styles.indexFailed]}>
                  {index + 1}
                </Text>
              </View>
              <View style={[styles.line, index === last && styles.lineHidden, lineAfter && styles.lineOn]} />
            </View>
            <Text style={[styles.short, (current || failed || done) && styles.shortOn]} numberOfLines={1}>
              {leg.short}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 14, marginBottom: 8 },
  cell: { flex: 1, alignItems: 'center' },
  nodeRow: { flexDirection: 'row', alignItems: 'center', width: '100%' },
  line: { flex: 1, height: 2, backgroundColor: Colors.border },
  lineHidden: { backgroundColor: 'transparent' },
  lineOn: { backgroundColor: Colors.orange },
  node: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeDone: { backgroundColor: Colors.orange, borderColor: Colors.orange },
  nodeCurrent: { borderColor: Colors.green },
  nodeFailed: { borderColor: Colors.red },
  index: { color: Colors.muted, fontFamily: sans, fontSize: 12, fontWeight: '800' },
  indexOn: { color: Colors.bg },
  indexCurrent: { color: Colors.green },
  indexFailed: { color: Colors.red },
  short: { marginTop: 6, color: Colors.muted, fontFamily: sans, fontSize: 11, fontWeight: '700' },
  shortOn: { color: Colors.text },
});
