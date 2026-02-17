import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ─── Tipos ────────────────────────────────────────────────────────────────────

type FriendStatus = "amigo" | "pendente_enviado" | "pendente_recebido";

interface Friend {
  id: number;
  nome: string;
  foto: string;
  ml: number;
  meta: number;
  status: FriendStatus;
  username: string;
}

interface GroupMember {
  id: number;
  nome: string;
  foto: string;
  ml: number;
  meta: number;
}

interface Group {
  id: number;
  name: string;
  code: string;
  isAdmin: boolean;
  members: GroupMember[];
  color: readonly [string, string];
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const ME = { id: 1, nome: "Luana Castro", username: "@luana.c" };

const INITIAL_FRIENDS: Friend[] = [
  { id: 2, nome: "Carlos Mendes", username: "@carlos.m", foto: "https://i.pravatar.cc/300?img=12", ml: 2600, meta: 2500, status: "amigo" },
  { id: 3, nome: "Beatriz Costa", username: "@bea.costa", foto: "https://i.pravatar.cc/300?img=45", ml: 2400, meta: 2000, status: "amigo" },
  { id: 4, nome: "Mariana Lima", username: "@mariana.l", foto: "https://i.pravatar.cc/300?img=28", ml: 2100, meta: 2000, status: "amigo" },
  { id: 5, nome: "Rafael Sousa", username: "@rafa.s", foto: "https://i.pravatar.cc/300?img=15", ml: 1700, meta: 2500, status: "amigo" },
  { id: 6, nome: "Fernanda Alves", username: "@fe.alves", foto: "https://i.pravatar.cc/300?img=47", ml: 0, meta: 2000, status: "pendente_recebido" },
  { id: 7, nome: "Pedro Nunes", username: "@pedro.n", foto: "https://i.pravatar.cc/300?img=11", ml: 0, meta: 2000, status: "pendente_enviado" },
];

const INITIAL_GROUPS: Group[] = [
  {
    id: 1, name: "Família Castro", code: "FAM123", isAdmin: true,
    color: ["#6096ba", "#274c77"] as const,
    members: [
      { id: 1, nome: "Luana Castro", foto: "https://i.pravatar.cc/300?img=32", ml: 2850, meta: 2500 },
      { id: 2, nome: "Carlos Mendes", foto: "https://i.pravatar.cc/300?img=12", ml: 2600, meta: 2500 },
      { id: 3, nome: "Beatriz Costa", foto: "https://i.pravatar.cc/300?img=45", ml: 1200, meta: 2000 },
    ],
  },
  {
    id: 2, name: "Turma do Trabalho", code: "WRK456", isAdmin: false,
    color: ["#a3cef1", "#6096ba"] as const,
    members: [
      { id: 4, nome: "Mariana Lima", foto: "https://i.pravatar.cc/300?img=28", ml: 2100, meta: 2000 },
      { id: 5, nome: "Rafael Sousa", foto: "https://i.pravatar.cc/300?img=15", ml: 1700, meta: 2500 },
      { id: 1, nome: "Luana Castro", foto: "https://i.pravatar.cc/300?img=32", ml: 2850, meta: 2500 },
    ],
  },
];

// Amigos que não estão num grupo (para poder convidar)
function friendsNotInGroup(friends: Friend[], group: Group): Friend[] {
  const memberIds = group.members.map((m) => m.id);
  return friends.filter((f) => f.status === "amigo" && !memberIds.includes(f.id));
}

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function PendingBanner({ friends, onAccept, onReject }: {
  friends: Friend[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const pending = friends.filter((f) => f.status === "pendente_recebido");
  if (pending.length === 0) return null;
  return (
    <View style={banner.wrapper}>
      <View style={banner.header}>
        <Ionicons name="people" size={16} color="#6096ba" />
        <Text style={banner.title}>Solicitações recebidas</Text>
        <View style={banner.pill}><Text style={banner.pillText}>{pending.length}</Text></View>
      </View>
      {pending.map((f) => (
        <View key={f.id} style={banner.row}>
          <Image source={{ uri: f.foto }} style={banner.photo} />
          <View style={banner.info}>
            <Text style={banner.name}>{f.nome}</Text>
            <Text style={banner.username}>{f.username}</Text>
          </View>
          <TouchableOpacity style={banner.btnAccept} onPress={() => onAccept(f.id)}>
            <Ionicons name="checkmark" size={18} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={banner.btnReject} onPress={() => onReject(f.id)}>
            <Ionicons name="close" size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const banner = StyleSheet.create({
  wrapper: {
    backgroundColor: "#EBF4FF", borderRadius: 18, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: "#BFDBFE",
  },
  header: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 10 },
  title: { fontSize: 13, fontWeight: "800", color: "#274c77", flex: 1 },
  pill: {
    backgroundColor: "#6096ba", borderRadius: 10,
    paddingHorizontal: 7, paddingVertical: 2,
  },
  pillText: { fontSize: 11, color: "white", fontWeight: "900" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  photo: { width: 38, height: 38, borderRadius: 19 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#334155" },
  username: { fontSize: 11, color: "#94A3B8" },
  btnAccept: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#10B981", justifyContent: "center", alignItems: "center",
  },
  btnReject: {
    width: 34, height: 34, borderRadius: 17,
    backgroundColor: "#FEF2F2", justifyContent: "center", alignItems: "center",
    borderWidth: 1, borderColor: "#FECACA",
  },
});

// ─── Modal de Convidar para Grupo ─────────────────────────────────────────────

function InviteToGroupModal({ group, friends, onClose }: {
  group: Group;
  friends: Friend[];
  onClose: () => void;
}) {
  const available = friendsNotInGroup(friends, group);
  const [sent, setSent] = useState<number[]>([]);

  const handleInvite = (friend: Friend) => {
    setSent((prev) => [...prev, friend.id]);
    // Aqui conectaria com o backend para enviar o convite
  };

  return (
    <View style={invite.overlay}>
      <View style={invite.sheet}>
        {/* Handle */}
        <View style={invite.handle} />

        <LinearGradient colors={group.color} style={invite.groupBadge}>
          <Text style={invite.groupBadgeName}>{group.name}</Text>
          <Text style={invite.groupBadgeCode}>Código: {group.code}</Text>
        </LinearGradient>

        <Text style={invite.sectionTitle}>Convidar amigos</Text>

        {available.length === 0 ? (
          <View style={invite.empty}>
            <Ionicons name="checkmark-circle" size={40} color="#10B981" />
            <Text style={invite.emptyText}>Todos os seus amigos já estão no grupo!</Text>
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 320 }}>
            {available.map((friend) => {
              const wasSent = sent.includes(friend.id);
              return (
                <View key={friend.id} style={invite.row}>
                  <Image source={{ uri: friend.foto }} style={invite.photo} />
                  <View style={invite.info}>
                    <Text style={invite.name}>{friend.nome}</Text>
                    <Text style={invite.username}>{friend.username}</Text>
                  </View>
                  <TouchableOpacity
                    style={[invite.btn, wasSent && invite.btnSent]}
                    onPress={() => !wasSent && handleInvite(friend)}
                    disabled={wasSent}
                  >
                    <Ionicons
                      name={wasSent ? "checkmark" : "paper-plane"}
                      size={16}
                      color={wasSent ? "#10B981" : "white"}
                    />
                    <Text style={[invite.btnText, wasSent && invite.btnTextSent]}>
                      {wasSent ? "Enviado" : "Convidar"}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        )}

        {/* Compartilhar código */}
        <View style={invite.codeBox}>
          <Text style={invite.codeLabel}>Ou compartilhe o código</Text>
          <View style={invite.codeRow}>
            <Text style={invite.codeValue}>{group.code}</Text>
            <TouchableOpacity
              style={invite.copyBtn}
              onPress={() => Alert.alert("Copiado!", `Código ${group.code} copiado.`)}
            >
              <Ionicons name="copy-outline" size={18} color="#6096ba" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={invite.closeBtn} onPress={onClose}>
          <Text style={invite.closeBtnText}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const invite = StyleSheet.create({
  overlay: {
    position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end", zIndex: 100,
  },
  sheet: {
    backgroundColor: "#F8FAFC", borderTopLeftRadius: 28, borderTopRightRadius: 28,
    padding: 20, paddingBottom: 36,
  },
  handle: {
    width: 40, height: 5, borderRadius: 3, backgroundColor: "#CBD5E1",
    alignSelf: "center", marginBottom: 16,
  },
  groupBadge: {
    borderRadius: 16, padding: 14, marginBottom: 20,
  },
  groupBadgeName: { fontSize: 18, fontWeight: "900", color: "white" },
  groupBadgeCode: { fontSize: 12, color: "rgba(255,255,255,0.75)", marginTop: 2 },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: "#334155", marginBottom: 12 },
  empty: { alignItems: "center", padding: 32, gap: 8 },
  emptyText: { fontSize: 14, color: "#94A3B8", textAlign: "center" },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 },
  photo: { width: 44, height: 44, borderRadius: 22 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#334155" },
  username: { fontSize: 12, color: "#94A3B8" },
  btn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#6096ba", paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 12,
  },
  btnSent: { backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0" },
  btnText: { fontSize: 13, fontWeight: "700", color: "white" },
  btnTextSent: { color: "#10B981" },
  codeBox: {
    backgroundColor: "#FFFFFF", borderRadius: 16, padding: 14,
    marginTop: 16, marginBottom: 12, borderWidth: 1, borderColor: "#E2E8F0",
  },
  codeLabel: { fontSize: 12, color: "#94A3B8", fontWeight: "600", marginBottom: 8 },
  codeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  codeValue: { fontSize: 22, fontWeight: "900", color: "#274c77", letterSpacing: 4 },
  copyBtn: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: "#EBF4FF",
    justifyContent: "center", alignItems: "center",
  },
  closeBtn: {
    backgroundColor: "#F1F5F9", borderRadius: 14, padding: 14, alignItems: "center",
  },
  closeBtnText: { fontSize: 15, fontWeight: "700", color: "#64748B" },
});

// ─── Tela Principal ───────────────────────────────────────────────────────────

type SubTab = "amigos" | "grupos";

export function CommunityScreen() {
  const [subTab, setSubTab] = useState<SubTab>("amigos");
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);

  // Amigos
  const [searchQuery, setSearchQuery] = useState("");
  const [addUsername, setAddUsername] = useState("");

  // Grupos
  const [newGroupName, setNewGroupName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [groupSubTab, setGroupSubTab] = useState<"lista" | "criar" | "entrar">("lista");
  const [inviteModalGroup, setInviteModalGroup] = useState<Group | null>(null);

  // ── Handlers de Amigos ─────────────────────────────────────────────────────

  const handleAcceptFriend = (id: number) => {
    setFriends((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "amigo" } : f))
    );
  };

  const handleRejectFriend = (id: number) => {
    setFriends((prev) => prev.filter((f) => f.id !== id));
  };

  const handleRemoveFriend = (id: number) => {
    Alert.alert(
      "Remover amigo",
      "Tem certeza que deseja remover este amigo?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Remover", style: "destructive", onPress: () =>
            setFriends((prev) => prev.filter((f) => f.id !== id))
        },
      ]
    );
  };

  const handleAddFriend = () => {
    if (!addUsername.trim()) return;
    Alert.alert("Solicitação enviada!", `Enviamos um convite para ${addUsername}.`);
    setAddUsername("");
  };

  // ── Handlers de Grupos ────────────────────────────────────────────────────

  const handleCreateGroup = () => {
    if (!newGroupName.trim()) return;
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setGroups((prev) => [
      ...prev,
      {
        id: Date.now(), name: newGroupName.trim(), code,
        isAdmin: true,
        color: ["#274c77", "#6096ba"] as const,
        members: [{ id: 1, nome: "Luana Castro", foto: "https://i.pravatar.cc/300?img=32", ml: 2850, meta: 2500 }],
      },
    ]);
    setNewGroupName("");
    setGroupSubTab("lista");
  };

  const handleJoinGroup = () => {
    if (!joinCode.trim()) return;
    Alert.alert("Entrou no grupo!", `Você entrou no grupo com código ${joinCode}.`);
    setJoinCode("");
    setGroupSubTab("lista");
  };

  // ── Dados filtrados ────────────────────────────────────────────────────────

  const confirmedFriends = friends.filter(
    (f) => f.status === "amigo" &&
      f.nome.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sentFriends = friends.filter((f) => f.status === "pendente_enviado");

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.screenTitle}>Comunidade</Text>
        <Text style={styles.screenSubtitle}>Amigos e grupos 💧</Text>
      </View>

      {/* Tabs principais */}
      <View style={styles.mainTabRow}>
        <TouchableOpacity
          style={[styles.mainTabBtn, subTab === "amigos" && styles.mainTabBtnActive]}
          onPress={() => setSubTab("amigos")}
        >
          <Ionicons name="person" size={16} color={subTab === "amigos" ? "#FFFFFF" : "#6096ba"} />
          <Text style={[styles.mainTabText, subTab === "amigos" && styles.mainTabTextActive]}>
            Amigos
          </Text>
          {friends.filter((f) => f.status === "amigo").length > 0 && (
            <View style={[styles.tabCount, subTab === "amigos" && styles.tabCountActive]}>
              <Text style={[styles.tabCountText, subTab === "amigos" && styles.tabCountTextActive]}>
                {friends.filter((f) => f.status === "amigo").length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.mainTabBtn, subTab === "grupos" && styles.mainTabBtnActive]}
          onPress={() => setSubTab("grupos")}
        >
          <Ionicons name="people" size={16} color={subTab === "grupos" ? "#FFFFFF" : "#6096ba"} />
          <Text style={[styles.mainTabText, subTab === "grupos" && styles.mainTabTextActive]}>
            Grupos
          </Text>
          {groups.length > 0 && (
            <View style={[styles.tabCount, subTab === "grupos" && styles.tabCountActive]}>
              <Text style={[styles.tabCountText, subTab === "grupos" && styles.tabCountTextActive]}>
                {groups.length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* ── ABA AMIGOS ────────────────────────────────────────────────────── */}
      {subTab === "amigos" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Solicitações pendentes */}
          <PendingBanner
            friends={friends}
            onAccept={handleAcceptFriend}
            onReject={handleRejectFriend}
          />

          {/* Adicionar amigo */}
          <View style={styles.addFriendCard}>
            <Text style={styles.sectionTitle}>Adicionar amigo</Text>
            <View style={styles.addRow}>
              <View style={styles.addInput}>
                <Ionicons name="at" size={18} color="#94A3B8" />
                <TextInput
                  style={styles.addInputText}
                  placeholder="usuário ou e-mail"
                  placeholderTextColor="#CBD5E1"
                  value={addUsername}
                  onChangeText={setAddUsername}
                  autoCapitalize="none"
                />
              </View>
              <TouchableOpacity
                style={[styles.addBtn, !addUsername.trim() && { opacity: 0.4 }]}
                onPress={handleAddFriend}
                disabled={!addUsername.trim()}
              >
                <Ionicons name="person-add" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Busca entre amigos */}
          {confirmedFriends.length > 0 && (
            <View style={styles.searchRow}>
              <Ionicons name="search" size={16} color="#94A3B8" />
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar amigos..."
                placeholderTextColor="#CBD5E1"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery !== "" && (
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* Lista de amigos */}
          <Text style={styles.sectionTitle}>
            Meus amigos
            {confirmedFriends.length > 0 && (
              <Text style={styles.sectionCount}> · {confirmedFriends.length}</Text>
            )}
          </Text>

          {confirmedFriends.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="people-outline" size={44} color="#CBD5E1" />
              <Text style={styles.emptyText}>
                {searchQuery ? "Nenhum amigo encontrado." : "Você ainda não tem amigos."}
              </Text>
              <Text style={styles.emptySubText}>Adicione alguém acima!</Text>
            </View>
          ) : (
            confirmedFriends.map((friend) => {
              const pct = Math.min((friend.ml / friend.meta) * 100, 100);
              const metaOk = friend.ml >= friend.meta;
              return (
                <View key={friend.id} style={styles.friendCard}>
                  <View style={styles.friendPhotoWrapper}>
                    <Image source={{ uri: friend.foto }} style={styles.friendPhoto} />
                    {metaOk && (
                      <View style={styles.metaDot}>
                        <Ionicons name="checkmark" size={9} color="white" />
                      </View>
                    )}
                  </View>
                  <View style={styles.friendInfo}>
                    <View style={styles.friendNameRow}>
                      <Text style={styles.friendName}>{friend.nome}</Text>
                      <Text style={styles.friendUsername}>{friend.username}</Text>
                    </View>
                    <View style={styles.friendBarRow}>
                      <View style={styles.friendBarBg}>
                        <View
                          style={[
                            styles.friendBarFill,
                            { width: `${pct}%` },
                            metaOk && styles.friendBarFillGreen,
                          ]}
                        />
                      </View>
                      <Text style={[styles.friendMl, metaOk && styles.friendMlGreen]}>
                        {friend.ml}ml
                      </Text>
                    </View>
                  </View>
                  <TouchableOpacity
                    style={styles.friendMenu}
                    onPress={() =>
                      Alert.alert(friend.nome, "O que deseja fazer?", [
                        { text: "Ver perfil" },
                        { text: "Remover amigo", style: "destructive", onPress: () => handleRemoveFriend(friend.id) },
                        { text: "Cancelar", style: "cancel" },
                      ])
                    }
                  >
                    <Ionicons name="ellipsis-horizontal" size={20} color="#CBD5E1" />
                  </TouchableOpacity>
                </View>
              );
            })
          )}

          {/* Pendentes enviados */}
          {sentFriends.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Aguardando resposta</Text>
              {sentFriends.map((f) => (
                <View key={f.id} style={[styles.friendCard, styles.friendCardPending]}>
                  <Image source={{ uri: f.foto }} style={styles.friendPhoto} />
                  <View style={styles.friendInfo}>
                    <Text style={styles.friendName}>{f.nome}</Text>
                    <Text style={styles.friendUsername}>{f.username}</Text>
                  </View>
                  <View style={styles.pendingBadge}>
                    <Text style={styles.pendingBadgeText}>Pendente</Text>
                  </View>
                </View>
              ))}
            </>
          )}
        </ScrollView>
      )}

      {/* ── ABA GRUPOS ───────────────────────────────────────────────────── */}
      {subTab === "grupos" && (
        <View style={styles.groupsWrapper}>
          {/* Sub-tabs dos grupos */}
          <View style={styles.groupSubTabRow}>
            {(["lista", "criar", "entrar"] as const).map((t) => (
              <TouchableOpacity
                key={t}
                style={[styles.groupSubTabBtn, groupSubTab === t && styles.groupSubTabBtnActive]}
                onPress={() => setGroupSubTab(t)}
              >
                <Text style={[styles.groupSubTabText, groupSubTab === t && styles.groupSubTabTextActive]}>
                  {t === "lista" ? "Meus Grupos" : t === "criar" ? "Criar" : "Entrar"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Lista de grupos */}
          {groupSubTab === "lista" && (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
              {groups.length === 0 ? (
                <View style={styles.emptyBox}>
                  <Ionicons name="people-outline" size={44} color="#CBD5E1" />
                  <Text style={styles.emptyText}>Nenhum grupo ainda.</Text>
                </View>
              ) : (
                groups.map((group) => {
                  const sortedMembers = [...group.members].sort((a, b) => b.ml - a.ml);
                  const canInvite = group.isAdmin;
                  return (
                    <View key={group.id} style={styles.groupCard}>
                      {/* Header do grupo */}
                      <LinearGradient colors={group.color} style={styles.groupHeader}>
                        <View style={styles.groupHeaderTop}>
                          <View>
                            <Text style={styles.groupName}>{group.name}</Text>
                            <Text style={styles.groupCode}>#{group.code}</Text>
                          </View>
                          <View style={styles.groupHeaderRight}>
                            {group.isAdmin && (
                              <View style={styles.adminBadge}>
                                <Ionicons name="shield-checkmark" size={12} color="#FFD700" />
                                <Text style={styles.adminBadgeText}>Admin</Text>
                              </View>
                            )}
                            <View style={styles.memberCountBadge}>
                              <Ionicons name="people" size={14} color="white" />
                              <Text style={styles.memberCountText}>{group.members.length}</Text>
                            </View>
                          </View>
                        </View>

                        {/* Fotos dos membros */}
                        <View style={styles.memberAvatarRow}>
                          {group.members.slice(0, 5).map((m, i) => (
                            <Image
                              key={m.id}
                              source={{ uri: m.foto }}
                              style={[styles.memberAvatar, { marginLeft: i === 0 ? 0 : -10, zIndex: 5 - i }]}
                            />
                          ))}
                          {group.members.length > 5 && (
                            <View style={[styles.memberAvatarMore, { marginLeft: -10 }]}>
                              <Text style={styles.memberAvatarMoreText}>+{group.members.length - 5}</Text>
                            </View>
                          )}
                        </View>
                      </LinearGradient>

                      {/* Ranking interno */}
                      <View style={styles.groupRanking}>
                        {sortedMembers.map((m, i) => {
                          const pct = Math.min((m.ml / m.meta) * 100, 100);
                          const isMe = m.id === 1;
                          return (
                            <View key={m.id} style={[styles.rankRow, isMe && styles.rankRowMe]}>
                              <Text style={styles.rankPos}>{i + 1}</Text>
                              <Image source={{ uri: m.foto }} style={styles.rankPhoto} />
                              <View style={styles.rankInfo}>
                                <View style={styles.rankNameRow}>
                                  <Text style={[styles.rankName, isMe && styles.rankNameMe]}>{m.nome}</Text>
                                  {isMe && <Text style={styles.youBadge}>você</Text>}
                                </View>
                                <View style={styles.rankBarBg}>
                                  <View style={[styles.rankBarFill, { width: `${pct}%` }, pct >= 100 && styles.rankBarFillGreen]} />
                                </View>
                              </View>
                              <Text style={[styles.rankMl, pct >= 100 && styles.rankMlGreen]}>{m.ml}ml</Text>
                            </View>
                          );
                        })}
                      </View>

                      {/* Ações do grupo */}
                      <View style={styles.groupActions}>
                        {canInvite && (
                          <TouchableOpacity
                            style={styles.groupActionBtn}
                            onPress={() => setInviteModalGroup(group)}
                          >
                            <Ionicons name="person-add" size={16} color="#6096ba" />
                            <Text style={styles.groupActionText}>Convidar amigos</Text>
                          </TouchableOpacity>
                        )}
                        <TouchableOpacity
                          style={[styles.groupActionBtn, styles.groupActionBtnGhost]}
                          onPress={() =>
                            Alert.alert(group.name, "O que deseja?", [
                              { text: "Compartilhar código", onPress: () =>
                                Alert.alert("Código copiado!", group.code) },
                              { text: group.isAdmin ? "Excluir grupo" : "Sair do grupo",
                                style: "destructive" },
                              { text: "Cancelar", style: "cancel" },
                            ])
                          }
                        >
                          <Ionicons name="ellipsis-horizontal" size={16} color="#94A3B8" />
                          <Text style={styles.groupActionTextGhost}>Mais opções</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                })
              )}
            </ScrollView>
          )}

          {/* Criar grupo */}
          {groupSubTab === "criar" && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.formCard}>
                <View style={styles.formIconWrapper}>
                  <Ionicons name="people" size={36} color="#6096ba" />
                </View>
                <Text style={styles.formTitle}>Novo Grupo</Text>
                <Text style={styles.formDesc}>
                  Crie um grupo com seus amigos e compete pela melhor hidratação!
                </Text>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Nome do grupo</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder="Ex: Família, Trabalho, Amigos..."
                    value={newGroupName}
                    onChangeText={setNewGroupName}
                    maxLength={30}
                  />
                  <Text style={styles.charCount}>{newGroupName.length}/30</Text>
                </View>
                <TouchableOpacity
                  style={[styles.formBtn, !newGroupName.trim() && { opacity: 0.4 }]}
                  onPress={handleCreateGroup}
                  disabled={!newGroupName.trim()}
                >
                  <Ionicons name="add-circle" size={20} color="white" />
                  <Text style={styles.formBtnText}>CRIAR GRUPO</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

          {/* Entrar em grupo */}
          {groupSubTab === "entrar" && (
            <ScrollView contentContainerStyle={styles.scrollContent}>
              <View style={styles.formCard}>
                <View style={styles.formIconWrapper}>
                  <Ionicons name="enter" size={36} color="#6096ba" />
                </View>
                <Text style={styles.formTitle}>Entrar com Código</Text>
                <Text style={styles.formDesc}>
                  Peça o código do grupo para quem criou e cole abaixo!
                </Text>
                <View style={styles.formField}>
                  <Text style={styles.formLabel}>Código do grupo</Text>
                  <TextInput
                    style={[styles.formInput, styles.codeInput]}
                    placeholder="XXXXXX"
                    value={joinCode}
                    onChangeText={(t) => setJoinCode(t.toUpperCase())}
                    maxLength={6}
                    autoCapitalize="characters"
                  />
                </View>
                <TouchableOpacity
                  style={[styles.formBtn, !joinCode.trim() && { opacity: 0.4 }]}
                  onPress={handleJoinGroup}
                  disabled={!joinCode.trim()}
                >
                  <Ionicons name="enter" size={20} color="white" />
                  <Text style={styles.formBtnText}>ENTRAR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      )}

      {/* Modal de convite */}
      {inviteModalGroup && (
        <InviteToGroupModal
          group={inviteModalGroup}
          friends={friends}
          onClose={() => setInviteModalGroup(null)}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },

  header: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4 },
  screenTitle: { fontSize: 26, fontWeight: "900", color: "#274c77" },
  screenSubtitle: { fontSize: 13, color: "#8b8c89", fontWeight: "500" },

  // Tabs principais
  mainTabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 10,
  },
  mainTabBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 12, borderRadius: 16,
    backgroundColor: "#EBF4FF", borderWidth: 1.5, borderColor: "#BFDBFE",
  },
  mainTabBtnActive: {
    backgroundColor: "#6096ba", borderColor: "#6096ba",
    elevation: 4, shadowColor: "#6096ba", shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  mainTabText: { fontSize: 15, fontWeight: "800", color: "#6096ba" },
  mainTabTextActive: { color: "white" },
  tabCount: {
    backgroundColor: "#BFDBFE", borderRadius: 10,
    paddingHorizontal: 6, paddingVertical: 1, minWidth: 22, alignItems: "center",
  },
  tabCountActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  tabCountText: { fontSize: 11, fontWeight: "900", color: "#6096ba" },
  tabCountTextActive: { color: "white" },

  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },

  // Seção
  sectionTitle: { fontSize: 14, fontWeight: "800", color: "#334155", marginBottom: 10 },
  sectionCount: { color: "#94A3B8" },

  // Empty
  emptyBox: { alignItems: "center", paddingVertical: 50, gap: 6 },
  emptyText: { fontSize: 15, fontWeight: "700", color: "#CBD5E1" },
  emptySubText: { fontSize: 13, color: "#CBD5E1" },

  // Add friend
  addFriendCard: {
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: "#E2E8F0",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  addRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  addInput: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#F8FAFC", borderRadius: 13, paddingHorizontal: 12,
    paddingVertical: 10, borderWidth: 1, borderColor: "#E2E8F0",
  },
  addInputText: { flex: 1, fontSize: 14, color: "#334155" },
  addBtn: {
    width: 46, height: 46, borderRadius: 14,
    backgroundColor: "#6096ba", justifyContent: "center", alignItems: "center",
    elevation: 3, shadowColor: "#6096ba", shadowOpacity: 0.3,
    shadowRadius: 6, shadowOffset: { width: 0, height: 3 },
  },

  // Search
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: "#FFFFFF", borderRadius: 13, paddingHorizontal: 12,
    paddingVertical: 10, borderWidth: 1, borderColor: "#E2E8F0", marginBottom: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#334155" },

  // Friend card
  friendCard: {
    flexDirection: "row", alignItems: "center", gap: 12,
    backgroundColor: "#FFFFFF", borderRadius: 18, padding: 12,
    marginBottom: 10, borderWidth: 1, borderColor: "#E2E8F0",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.04,
    shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
  },
  friendCardPending: { opacity: 0.7, borderStyle: "dashed" },
  friendPhotoWrapper: { position: "relative" },
  friendPhoto: { width: 48, height: 48, borderRadius: 24 },
  metaDot: {
    position: "absolute", bottom: 0, right: 0,
    width: 16, height: 16, borderRadius: 8,
    backgroundColor: "#10B981", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "white",
  },
  friendInfo: { flex: 1, gap: 4 },
  friendNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  friendName: { fontSize: 14, fontWeight: "700", color: "#334155" },
  friendUsername: { fontSize: 11, color: "#94A3B8" },
  friendBarRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  friendBarBg: { flex: 1, height: 4, backgroundColor: "#E3F2FD", borderRadius: 2, overflow: "hidden" },
  friendBarFill: { height: "100%", backgroundColor: "#a3cef1", borderRadius: 2 },
  friendBarFillGreen: { backgroundColor: "#10B981" },
  friendMl: { fontSize: 12, fontWeight: "900", color: "#6096ba", minWidth: 48, textAlign: "right" },
  friendMlGreen: { color: "#10B981" },
  friendMenu: { padding: 4 },
  pendingBadge: {
    backgroundColor: "#FEF9C3", paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 10, borderWidth: 1, borderColor: "#FDE68A",
  },
  pendingBadgeText: { fontSize: 11, fontWeight: "700", color: "#92400E" },

  // Grupos
  groupsWrapper: { flex: 1 },
  groupSubTabRow: {
    flexDirection: "row", marginHorizontal: 20, marginBottom: 12,
    backgroundColor: "#F1F5F9", borderRadius: 14, padding: 4,
  },
  groupSubTabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  groupSubTabBtnActive: {
    backgroundColor: "#FFFFFF",
    elevation: 2, shadowColor: "#000", shadowOpacity: 0.06,
    shadowRadius: 4, shadowOffset: { width: 0, height: 1 },
  },
  groupSubTabText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  groupSubTabTextActive: { color: "#274c77", fontWeight: "800" },

  groupCard: {
    backgroundColor: "#FFFFFF", borderRadius: 22, marginBottom: 16,
    overflow: "hidden", elevation: 4, shadowColor: "#6096ba",
    shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
  },
  groupHeader: { padding: 16 },
  groupHeaderTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  groupName: { fontSize: 18, fontWeight: "900", color: "white" },
  groupCode: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  groupHeaderRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  adminBadge: {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "rgba(0,0,0,0.25)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  adminBadgeText: { fontSize: 11, color: "#FFD700", fontWeight: "700" },
  memberCountBadge: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10,
  },
  memberCountText: { fontSize: 13, color: "white", fontWeight: "700" },
  memberAvatarRow: { flexDirection: "row", alignItems: "center" },
  memberAvatar: { width: 30, height: 30, borderRadius: 15, borderWidth: 2, borderColor: "rgba(255,255,255,0.6)" },
  memberAvatarMore: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.4)",
  },
  memberAvatarMoreText: { fontSize: 10, color: "white", fontWeight: "900" },

  groupRanking: { padding: 12, gap: 8 },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  rankRowMe: { backgroundColor: "#EBF4FF", borderRadius: 12, padding: 6, marginHorizontal: -4 },
  rankPos: { fontSize: 13, fontWeight: "900", color: "#94A3B8", width: 16, textAlign: "center" },
  rankPhoto: { width: 34, height: 34, borderRadius: 17 },
  rankInfo: { flex: 1 },
  rankNameRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 3 },
  rankName: { fontSize: 13, fontWeight: "700", color: "#334155" },
  rankNameMe: { color: "#274c77" },
  youBadge: {
    fontSize: 9, fontWeight: "900", color: "#6096ba",
    backgroundColor: "#DBEAFE", paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6,
  },
  rankBarBg: { height: 4, backgroundColor: "#E3F2FD", borderRadius: 2, overflow: "hidden" },
  rankBarFill: { height: "100%", backgroundColor: "#a3cef1", borderRadius: 2 },
  rankBarFillGreen: { backgroundColor: "#10B981" },
  rankMl: { fontSize: 13, fontWeight: "900", color: "#6096ba", minWidth: 52, textAlign: "right" },
  rankMlGreen: { color: "#10B981" },

  groupActions: {
    flexDirection: "row", gap: 8, padding: 12,
    borderTopWidth: 1, borderTopColor: "#F1F5F9",
  },
  groupActionBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, backgroundColor: "#EBF4FF", paddingVertical: 10, borderRadius: 12,
    borderWidth: 1, borderColor: "#BFDBFE",
  },
  groupActionBtnGhost: { backgroundColor: "#F8FAFC", borderColor: "#E2E8F0" },
  groupActionText: { fontSize: 13, fontWeight: "700", color: "#6096ba" },
  groupActionTextGhost: { fontSize: 13, fontWeight: "700", color: "#94A3B8" },

  // Formulários
  formCard: {
    backgroundColor: "#FFFFFF", borderRadius: 24, padding: 24,
    alignItems: "center", elevation: 3, shadowColor: "#000",
    shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 2 },
    marginTop: 4,
  },
  formIconWrapper: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#EBF4FF", justifyContent: "center", alignItems: "center", marginBottom: 12,
  },
  formTitle: { fontSize: 20, fontWeight: "900", color: "#274c77", marginBottom: 6 },
  formDesc: { fontSize: 13, color: "#94A3B8", textAlign: "center", marginBottom: 20, lineHeight: 18 },
  formField: { width: "100%", marginBottom: 20 },
  formLabel: { fontSize: 12, fontWeight: "700", color: "#94A3B8", marginBottom: 8 },
  formInput: {
    backgroundColor: "#F8FAFC", borderRadius: 14, padding: 16,
    fontSize: 16, borderWidth: 1, borderColor: "#E2E8F0", color: "#334155",
  },
  codeInput: { textAlign: "center", letterSpacing: 6, fontSize: 22, fontWeight: "900" },
  charCount: { fontSize: 11, color: "#CBD5E1", textAlign: "right", marginTop: 4 },
  formBtn: {
    width: "100%", flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 8, backgroundColor: "#6096ba", padding: 16, borderRadius: 14,
    elevation: 4, shadowColor: "#6096ba", shadowOpacity: 0.3,
    shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  formBtnText: { color: "white", fontWeight: "900", fontSize: 16 },
});
