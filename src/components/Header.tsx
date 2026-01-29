import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export function Header() {
  return (
    <View style={styles.topBar}>
      <TouchableOpacity><Ionicons name="menu" size={32} color="#2B5B8E" /></TouchableOpacity>
      <TouchableOpacity><Ionicons name="settings-outline" size={28} color="#2B5B8E" /></TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 10 },
});