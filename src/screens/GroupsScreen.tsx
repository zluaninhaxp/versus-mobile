import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface Group {
  id: number;
  name: string;
  members: {
    id: number;
    foto: string;
    nome: string;
    ml: number;
    meta: number;
  }[];
  code: string;
}

const MOCK_GROUPS: Group[] = [
  {
    id: 1,
    name: "Família Castro",
    code: "FAM123",
    members: [
      {
        id: 1,
        nome: "Luana Castro",
        foto: "https://i.pravatar.cc/300?img=32",
        ml: 2850,
        meta: 2500,
      },
      {
        id: 2,
        nome: "Carlos Mendes",
        foto: "https://i.pravatar.cc/300?img=12",
        ml: 2600,
        meta: 2500,
      },
    ],
  },
  {
    id: 2,
    name: "Trabalho",
    code: "WRK456",
    members: [
      {
        id: 3,
        nome: "Beatriz Costa",
        foto: "https://i.pravatar.cc/300?img=45",
        ml: 2400,
        meta: 2000,
      },
      {
        id: 4,
        nome: "Mariana Lima",
        foto: "https://i.pravatar.cc/300?img=28",
        ml: 2100,
        meta: 2000,
      },
      {
        id: 5,
        nome: "Rafael Sousa",
        foto: "https://i.pravatar.cc/300?img=15",
        ml: 1700,
        meta: 2500,
      },
    ],
  },
];

export function GroupsScreen() {
  const [groups, setGroups] = useState<Group[]>(MOCK_GROUPS);
  const [tab, setTab] = useState<"meus" | "criar" | "entrar">("meus");
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroups([
      ...groups,
      {
        id: Date.now(),
        name: newGroupName.trim(),
        code,
        members: [
          {
            id: 1,
            nome: "Luana Castro",
            foto: "https://i.pravatar.cc/300?img=32",
            ml: 2850,
            meta: 2500,
          },
        ],
      },
    ]);
    setNewGroupName("");
    setTab("meus");
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      <Text style={styles.screenTitle}>Grupos</Text>
      <Text style={styles.screenSubtitle}>Compete com quem você ama 💧</Text>

      {/* Tabs */}
      <View style={styles.tabRow}>
        {(["meus", "criar", "entrar"] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tabBtn, tab === t && styles.tabBtnActive]}
            onPress={() => setTab(t)}
          >
            <Text
              style={[styles.tabBtnText, tab === t && styles.tabBtnTextActive]}
            >
              {t === "meus"
                ? "Meus Grupos"
                : t === "criar"
                  ? "Criar"
                  : "Entrar"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Meus Grupos */}
      {tab === "meus" && (
        <View>
          {groups.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={48} color="#CBD5E1" />
              <Text style={styles.emptyText}>Nenhum grupo ainda.</Text>
              <Text style={styles.emptySubText}>
                Crie ou entre em um grupo!
              </Text>
            </View>
          ) : (
            groups.map((group) => (
              <View key={group.id} style={styles.groupCard}>
                <LinearGradient
                  colors={["#6096ba", "#a3cef1"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.groupCardHeader}
                >
                  <View>
                    <Text style={styles.groupName}>{group.name}</Text>
                    <Text style={styles.groupCode}>Código: {group.code}</Text>
                  </View>
                  <View style={styles.membersCount}>
                    <Ionicons name="people" size={18} color="white" />
                    <Text style={styles.membersCountText}>
                      {group.members.length}
                    </Text>
                  </View>
                </LinearGradient>

                <View style={styles.groupMembers}>
                  {group.members.map((m, i) => {
                    const pct = Math.min((m.ml / m.meta) * 100, 100);
                    return (
                      <View key={m.id} style={styles.memberRow}>
                        <View style={styles.memberRank}>
                          <Text style={styles.memberRankText}>{i + 1}</Text>
                        </View>
                        <Image
                          source={{ uri: m.foto }}
                          style={styles.memberPhoto}
                        />
                        <View style={styles.memberInfo}>
                          <Text style={styles.memberName}>{m.nome}</Text>
                          <View style={styles.miniBarBg}>
                            <View
                              style={[styles.miniBarFill, { width: `${pct}%` }]}
                            />
                          </View>
                        </View>
                        <Text style={styles.memberMl}>{m.ml}ml</Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* Criar Grupo */}
      {tab === "criar" && (
        <View style={styles.formCard}>
          <View style={styles.formIcon}>
            <Ionicons name="people" size={36} color="#6096ba" />
          </View>
          <Text style={styles.formTitle}>Novo Grupo</Text>
          <Text style={styles.formLabel}>Nome do grupo</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Família, Trabalho..."
            value={newGroupName}
            onChangeText={setNewGroupName}
            maxLength={30}
          />
          <TouchableOpacity
            style={[styles.actionBtn, !newGroupName.trim() && { opacity: 0.5 }]}
            onPress={handleCreateGroup}
            disabled={!newGroupName.trim()}
          >
            <Text style={styles.actionBtnText}>CRIAR GRUPO</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Entrar em Grupo */}
      {tab === "entrar" && (
        <View style={styles.formCard}>
          <View style={styles.formIcon}>
            <Ionicons name="enter" size={36} color="#6096ba" />
          </View>
          <Text style={styles.formTitle}>Entrar com Código</Text>
          <Text style={styles.formLabel}>Código do grupo</Text>
          <TextInput
            style={[styles.input, styles.codeInput]}
            placeholder="Ex: FAM123"
            value={joinCode}
            onChangeText={(t) => setJoinCode(t.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
          />
          <TouchableOpacity
            style={[styles.actionBtn, !joinCode.trim() && { opacity: 0.5 }]}
            disabled={!joinCode.trim()}
          >
            <Text style={styles.actionBtnText}>ENTRAR</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 40 },
  screenTitle: { fontSize: 26, fontWeight: "900", color: "#274c77" },
  screenSubtitle: {
    fontSize: 13,
    color: "#8b8c89",
    fontWeight: "500",
    marginBottom: 20,
  },

  tabRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 4,
    marginBottom: 20,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  tabBtnText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  tabBtnTextActive: { color: "#274c77", fontWeight: "800" },

  emptyBox: { alignItems: "center", paddingVertical: 60 },
  emptyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#CBD5E1",
    marginTop: 12,
  },
  emptySubText: { fontSize: 13, color: "#CBD5E1", marginTop: 4 },

  groupCard: {
    borderRadius: 20,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#6096ba",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    backgroundColor: "#fff",
  },
  groupCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  groupName: { fontSize: 18, fontWeight: "900", color: "white" },
  groupCode: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  membersCount: { flexDirection: "row", alignItems: "center", gap: 4 },
  membersCountText: { color: "white", fontWeight: "bold", fontSize: 16 },

  groupMembers: { padding: 12, gap: 10 },
  memberRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  memberRank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  memberRankText: { fontSize: 12, fontWeight: "bold", color: "#64748B" },
  memberPhoto: { width: 36, height: 36, borderRadius: 18 },
  memberInfo: { flex: 1 },
  memberName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 4,
  },
  miniBarBg: {
    height: 4,
    backgroundColor: "#E3F2FD",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniBarFill: { height: "100%", backgroundColor: "#6096ba", borderRadius: 2 },
  memberMl: { fontSize: 13, fontWeight: "900", color: "#6096ba" },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  formIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EBF4FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#274c77",
    marginBottom: 20,
  },
  formLabel: {
    alignSelf: "flex-start",
    fontSize: 12,
    fontWeight: "bold",
    color: "#94A3B8",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    backgroundColor: "#F8FAFC",
    borderRadius: 15,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#334155",
    marginBottom: 20,
  },
  codeInput: {
    textAlign: "center",
    letterSpacing: 4,
    fontSize: 20,
    fontWeight: "900",
  },
  actionBtn: {
    width: "100%",
    backgroundColor: "#6096ba",
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
  },
  actionBtnText: { color: "white", fontWeight: "900", fontSize: 16 },
});
