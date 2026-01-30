import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  currentName: string;
  onSave: (newName: string) => void;
}

export function ProfileModal({ visible, onClose, currentName, onSave }: ProfileModalProps) {
  const [newName, setNewName] = useState(currentName);

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container} onStartShouldSetResponder={() => true}>
          <View style={styles.header}>
            <Text style={styles.title}>Meu Perfil</Text>
            <TouchableOpacity onPress={onClose}><Ionicons name="close" size={24} color="#888" /></TouchableOpacity>
          </View>

          <View style={styles.avatarBig}>
             <Ionicons name="person" size={50} color="#4CAFFF" />
             <TouchableOpacity style={styles.editPhoto}><Ionicons name="camera" size={18} color="white" /></TouchableOpacity>
          </View>

          <Text style={styles.label}>NOME DE EXIBIÇÃO</Text>
          <TextInput 
            style={styles.input}
            value={newName}
            onChangeText={setNewName}
            placeholder="Seu nome"
          />

          <TouchableOpacity style={styles.btn} onPress={() => { onSave(newName); onClose(); }}>
            <Text style={styles.btnText}>ATUALIZAR PERFIL</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', backgroundColor: 'white', borderRadius: 30, padding: 25 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2B5B8E' },
  avatarBig: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#F0F7FF', alignSelf: 'center', justifyContent: 'center', alignItems: 'center', marginBottom: 20 },
  editPhoto: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#4CAFFF', padding: 8, borderRadius: 15 },
  label: { fontSize: 12, fontWeight: 'bold', color: '#BDC3C7', marginBottom: 8 },
  input: { backgroundColor: '#F5F9FF', padding: 15, borderRadius: 15, fontSize: 16, color: '#2B5B8E', marginBottom: 20 },
  btn: { backgroundColor: '#4CAFFF', padding: 18, borderRadius: 15, alignItems: 'center' },
  btnText: { color: 'white', fontWeight: 'bold' }
});