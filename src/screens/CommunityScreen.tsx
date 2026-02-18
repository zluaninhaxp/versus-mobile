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
  Clipboard,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheetModal } from "../components/BottomSheetModal";
import { RankItem } from "../components/RankItem";

// ─── Paleta ───────────────────────────────────────────────────────────────────
// Azul app:    #274c77 / #6096ba / #a3cef1   → ranking (home)
// Header grupo: tons quentes/neutros escuros → contraste intencional com o ranking
const GROUP_PALETTES: readonly (readonly [string, string])[] = [
  ["#1B2A3B", "#2E4A6A"] as const, // slate profundo
  ["#2D1B4E", "#4A2E7A"] as const, // roxo escuro
  ["#1E3A2F", "#2E6B4A"] as const, // verde floresta
  ["#3B1A1A", "#6B2E2E"] as const, // vinho
  ["#1A2E3B", "#1B4F6B"] as const, // petróleo
];

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
  reactions?: { emoji: string; count: number }[];
}
interface Group {
  id: number;
  name: string;
  code: string;
  isAdmin: boolean;
  members: GroupMember[];
  color: readonly [string, string];
}
type ActivityType = "meta" | "conquista" | "badge" | "top1" | "streak";
interface Activity {
  id: number;
  friendId: number;
  type: ActivityType;
  time: string;
  extra?: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const INITIAL_FRIENDS: Friend[] = [
  {
    id: 2,
    nome: "Carlos Mendes",
    username: "@carlos.m",
    foto: "https://i.pravatar.cc/300?img=12",
    ml: 2600,
    meta: 2500,
    status: "amigo",
  },
  {
    id: 3,
    nome: "Beatriz Costa",
    username: "@bea.costa",
    foto: "https://i.pravatar.cc/300?img=45",
    ml: 2400,
    meta: 2000,
    status: "amigo",
  },
  {
    id: 4,
    nome: "Mariana Lima",
    username: "@mariana.l",
    foto: "https://i.pravatar.cc/300?img=28",
    ml: 2100,
    meta: 2000,
    status: "amigo",
  },
  {
    id: 5,
    nome: "Rafael Sousa",
    username: "@rafa.s",
    foto: "https://i.pravatar.cc/300?img=15",
    ml: 1700,
    meta: 2500,
    status: "amigo",
  },
  {
    id: 6,
    nome: "Fernanda Alves",
    username: "@fe.alves",
    foto: "https://i.pravatar.cc/300?img=47",
    ml: 0,
    meta: 2000,
    status: "pendente_recebido",
  },
  {
    id: 7,
    nome: "Pedro Nunes",
    username: "@pedro.n",
    foto: "https://i.pravatar.cc/300?img=11",
    ml: 0,
    meta: 2000,
    status: "pendente_recebido",
  },
  {
    id: 8,
    nome: "Juliana Torres",
    username: "@ju.torres",
    foto: "https://i.pravatar.cc/300?img=9",
    ml: 0,
    meta: 2000,
    status: "pendente_recebido",
  },
  {
    id: 9,
    nome: "André Lima",
    username: "@andrelima",
    foto: "https://i.pravatar.cc/300?img=53",
    ml: 0,
    meta: 2000,
    status: "pendente_enviado",
  },
];

const FEED: Activity[] = [
  { id: 1, friendId: 2, type: "meta", time: "há 12min" },
  { id: 2, friendId: 3, type: "top1", time: "há 45min" },
  {
    id: 3,
    friendId: 4,
    type: "conquista",
    time: "há 1h",
    extra: "Sequência de 7 dias 🔥",
  },
  {
    id: 4,
    friendId: 2,
    type: "badge",
    time: "há 2h",
    extra: "Hidratado da Semana 💧",
  },
  {
    id: 5,
    friendId: 5,
    type: "streak",
    time: "há 3h",
    extra: "5 dias seguidos",
  },
  {
    id: 6,
    friendId: 3,
    type: "conquista",
    time: "ontem",
    extra: "Primeira Gota ✨",
  },
];

const INITIAL_GROUPS: Group[] = [
  {
    id: 1,
    name: "Família Castro",
    code: "FAM123",
    isAdmin: true,
    color: GROUP_PALETTES[0],
    members: [
      {
        id: 1,
        nome: "Luana Castro",
        foto: "https://i.pravatar.cc/300?img=32",
        ml: 2850,
        meta: 2500,
        reactions: [{ emoji: "❤️", count: 3 }],
      },
      {
        id: 2,
        nome: "Carlos Mendes",
        foto: "https://i.pravatar.cc/300?img=12",
        ml: 2600,
        meta: 2500,
        reactions: [],
      },
      {
        id: 3,
        nome: "Beatriz Costa",
        foto: "https://i.pravatar.cc/300?img=45",
        ml: 1200,
        meta: 2000,
        reactions: [],
      },
    ],
  },
  {
    id: 2,
    name: "Turma do Trabalho",
    code: "WRK456",
    isAdmin: false,
    color: GROUP_PALETTES[1],
    members: [
      {
        id: 4,
        nome: "Mariana Lima",
        foto: "https://i.pravatar.cc/300?img=28",
        ml: 2100,
        meta: 2000,
        reactions: [],
      },
      {
        id: 5,
        nome: "Rafael Sousa",
        foto: "https://i.pravatar.cc/300?img=15",
        ml: 1700,
        meta: 2500,
        reactions: [],
      },
      {
        id: 1,
        nome: "Luana Castro",
        foto: "https://i.pravatar.cc/300?img=32",
        ml: 2850,
        meta: 2500,
        reactions: [],
      },
    ],
  },
];

const ACTIVITY_CONFIG: Record<
  ActivityType,
  { bg: readonly [string, string]; label: (e?: string) => string; icon: string }
> = {
  meta: {
    bg: ["#0EA5E9", "#0369A1"] as const,
    label: () => "Bateu a meta de hoje! 🎯",
    icon: "trophy",
  },
  conquista: {
    bg: ["#F59E0B", "#D97706"] as const,
    label: (e) => `Desbloqueou: ${e}`,
    icon: "ribbon",
  },
  badge: {
    bg: ["#8B5CF6", "#6D28D9"] as const,
    label: (e) => `Ganhou o badge: ${e}`,
    icon: "medal",
  },
  top1: {
    bg: ["#F59E0B", "#B45309"] as const,
    label: () => "Assumiu o 1º lugar! 🥇",
    icon: "podium",
  },
  streak: {
    bg: ["#EF4444", "#B91C1C"] as const,
    label: (e) => `Sequência incrível: ${e} 🔥`,
    icon: "flame",
  },
};

function firstName(nome: string) {
  return nome.split(" ")[0];
}

// ─── Sheet: Solicitações ──────────────────────────────────────────────────────

function RequestsSheet({
  visible,
  onClose,
  friends,
  onAccept,
  onReject,
}: {
  visible: boolean;
  onClose: () => void;
  friends: Friend[];
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
}) {
  const received = friends.filter((f) => f.status === "pendente_recebido");
  const sent = friends.filter((f) => f.status === "pendente_enviado");
  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      height={0.62}
      backgroundColor="#F8FAFC"
    >
      <Text style={sh.title}>Solicitações</Text>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {received.length > 0 && (
          <>
            <Text style={sh.label}>RECEBIDAS</Text>
            {received.map((f) => (
              <View key={f.id} style={sh.row}>
                <Image source={{ uri: f.foto }} style={sh.photo} />
                <View style={sh.info}>
                  <Text style={sh.name}>{f.nome}</Text>
                  <Text style={sh.username}>{f.username}</Text>
                </View>
                <TouchableOpacity
                  style={sh.acceptBtn}
                  onPress={() => onAccept(f.id)}
                >
                  <Ionicons name="checkmark" size={18} color="white" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={sh.rejectBtn}
                  onPress={() => onReject(f.id)}
                >
                  <Ionicons name="close" size={18} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
        {sent.length > 0 && (
          <>
            <Text style={[sh.label, { marginTop: 20 }]}>ENVIADAS</Text>
            {sent.map((f) => (
              <View key={f.id} style={[sh.row, { opacity: 0.6 }]}>
                <Image source={{ uri: f.foto }} style={sh.photo} />
                <View style={sh.info}>
                  <Text style={sh.name}>{f.nome}</Text>
                  <Text style={sh.username}>{f.username}</Text>
                </View>
                <View style={sh.chip}>
                  <Text style={sh.chipText}>Aguardando</Text>
                </View>
              </View>
            ))}
          </>
        )}
        {received.length === 0 && sent.length === 0 && (
          <View style={sh.empty}>
            <Ionicons
              name="checkmark-circle-outline"
              size={44}
              color="#CBD5E1"
            />
            <Text style={sh.emptyText}>Tudo em dia!</Text>
          </View>
        )}
      </ScrollView>
    </BottomSheetModal>
  );
}

const sh = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#274c77",
    marginBottom: 16,
  },
  label: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  photo: { width: 44, height: 44, borderRadius: 22 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#334155" },
  username: { fontSize: 12, color: "#94A3B8" },
  acceptBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#6096ba",
    justifyContent: "center",
    alignItems: "center",
  },
  rejectBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  chip: {
    backgroundColor: "#FEF9C3",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  chipText: { fontSize: 11, fontWeight: "700", color: "#92400E" },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: { fontSize: 14, color: "#CBD5E1", fontWeight: "600" },
});

// ─── Sheet: Adicionar amigo ───────────────────────────────────────────────────

function AddFriendSheet({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);
  const [sent, setSent] = useState<number[]>([]);
  const MOCK = [
    {
      id: 10,
      nome: "Gabriela Mota",
      username: "@gabi.mota",
      foto: "https://i.pravatar.cc/300?img=20",
    },
    {
      id: 11,
      nome: "Lucas Ferreira",
      username: "@luka.f",
      foto: "https://i.pravatar.cc/300?img=33",
    },
  ];
  const results = searched && query.length >= 2 ? MOCK : [];
  const handleClose = () => {
    setQuery("");
    setSearched(false);
    setSent([]);
    onClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      height={0.52}
      backgroundColor="#F8FAFC"
    >
      <Text style={af.title}>Adicionar amigo</Text>
      <View style={af.box}>
        <Ionicons name="search-outline" size={18} color="#94A3B8" />
        <TextInput
          style={af.input}
          placeholder="Nome de usuário ou e-mail..."
          placeholderTextColor="#CBD5E1"
          value={query}
          onChangeText={setQuery}
          autoCapitalize="none"
          returnKeyType="search"
          onSubmitEditing={() => setSearched(true)}
          autoFocus
        />
        {query.length > 0 && (
          <TouchableOpacity
            onPress={() => {
              setQuery("");
              setSearched(false);
            }}
          >
            <Ionicons name="close-circle" size={18} color="#CBD5E1" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={[af.btn, query.length < 2 && { opacity: 0.4 }]}
        disabled={query.length < 2}
        onPress={() => setSearched(true)}
      >
        <Text style={af.btnText}>Buscar</Text>
      </TouchableOpacity>
      {searched && results.length === 0 && (
        <View style={af.empty}>
          <Text style={af.emptyText}>Nenhum usuário encontrado</Text>
        </View>
      )}
      {results.map((u) => {
        const isSent = sent.includes(u.id);
        return (
          <View key={u.id} style={af.row}>
            <Image source={{ uri: u.foto }} style={af.photo} />
            <View style={af.info}>
              <Text style={af.name}>{u.nome}</Text>
              <Text style={af.username}>{u.username}</Text>
            </View>
            <TouchableOpacity
              style={[af.addBtn, isSent && af.addBtnSent]}
              onPress={() => setSent((p) => [...p, u.id])}
              disabled={isSent}
            >
              <Ionicons
                name={isSent ? "checkmark" : "person-add-outline"}
                size={16}
                color={isSent ? "#10B981" : "white"}
              />
              <Text style={[af.addBtnText, isSent && { color: "#10B981" }]}>
                {isSent ? "Enviado" : "Adicionar"}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </BottomSheetModal>
  );
}

const af = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#274c77",
    marginBottom: 16,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 10,
  },
  input: { flex: 1, fontSize: 15, color: "#334155" },
  btn: {
    backgroundColor: "#6096ba",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  btnText: { color: "white", fontWeight: "800", fontSize: 15 },
  empty: { alignItems: "center", paddingVertical: 20 },
  emptyText: { fontSize: 14, color: "#CBD5E1", fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  photo: { width: 46, height: 46, borderRadius: 23 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#334155" },
  username: { fontSize: 12, color: "#94A3B8" },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#6096ba",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  addBtnSent: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  addBtnText: { fontSize: 13, fontWeight: "700", color: "white" },
});

// ─── Sheet: Compartilhar código do grupo ─────────────────────────────────────

function ShareGroupSheet({
  visible,
  onClose,
  group,
}: {
  visible: boolean;
  onClose: () => void;
  group: Group | null;
}) {
  const [copied, setCopied] = useState(false);
  if (!group) return null;

  const handleCopy = () => {
    Clipboard.setString(group.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={onClose}
      height={0.42}
      backgroundColor="#F8FAFC"
    >
      <Text style={sg.title}>Compartilhar grupo</Text>
      <Text style={sg.subtitle}>
        Envie o código abaixo para quem quiser entrar
      </Text>

      {/* Código visual em destaque */}
      <LinearGradient colors={group.color} style={sg.codeCard}>
        <Text style={sg.groupNameLabel}>{group.name}</Text>
        <Text style={sg.codeText}>{group.code}</Text>
        <Text style={sg.codeHint}>código de entrada</Text>
      </LinearGradient>

      {/* Botão copiar */}
      <TouchableOpacity
        style={[sg.copyBtn, copied && sg.copyBtnDone]}
        onPress={handleCopy}
      >
        <Ionicons
          name={copied ? "checkmark-circle" : "copy-outline"}
          size={20}
          color={copied ? "#10B981" : "white"}
        />
        <Text style={[sg.copyBtnText, copied && { color: "#10B981" }]}>
          {copied ? "Copiado!" : "Copiar código"}
        </Text>
      </TouchableOpacity>

      <Text style={sg.or}>— ou compartilhe via —</Text>

      <View style={sg.shareRow}>
        {[
          { icon: "logo-whatsapp", label: "WhatsApp", color: "#25D366" },
          { icon: "chatbubble-ellipses", label: "Mensagem", color: "#6096ba" },
          {
            icon: "ellipsis-horizontal-circle",
            label: "Outros",
            color: "#94A3B8",
          },
        ].map((s) => (
          <TouchableOpacity
            key={s.label}
            style={sg.shareItem}
            onPress={() =>
              Alert.alert(
                s.label,
                `Compartilhar código ${group.code} via ${s.label}`,
              )
            }
          >
            <View style={[sg.shareIcon, { backgroundColor: s.color + "1A" }]}>
              <Ionicons name={s.icon as any} size={24} color={s.color} />
            </View>
            <Text style={sg.shareLabel}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </BottomSheetModal>
  );
}

const sg = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "900", color: "#274c77", marginBottom: 4 },
  subtitle: { fontSize: 13, color: "#94A3B8", marginBottom: 16 },
  codeCard: {
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  groupNameLabel: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
    marginBottom: 8,
  },
  codeText: {
    fontSize: 36,
    fontWeight: "900",
    color: "white",
    letterSpacing: 8,
  },
  codeHint: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    marginTop: 6,
    fontWeight: "600",
  },
  copyBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#274c77",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
  },
  copyBtnDone: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  copyBtnText: { fontSize: 15, fontWeight: "800", color: "white" },
  or: { textAlign: "center", fontSize: 12, color: "#CBD5E1", marginBottom: 16 },
  shareRow: { flexDirection: "row", justifyContent: "center", gap: 24 },
  shareItem: { alignItems: "center", gap: 6 },
  shareIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: "center",
    alignItems: "center",
  },
  shareLabel: { fontSize: 11, color: "#64748B", fontWeight: "600" },
});

// ─── Sheet: Convidar amigos para grupo ───────────────────────────────────────

function InviteToGroupSheet({
  visible,
  onClose,
  group,
  friends,
}: {
  visible: boolean;
  onClose: () => void;
  group: Group | null;
  friends: Friend[];
}) {
  const [inviteSent, setInviteSent] = useState<number[]>([]);
  if (!group) return null;

  const available = friends.filter(
    (f) => f.status === "amigo" && !group.members.find((m) => m.id === f.id),
  );

  const handleClose = () => {
    setInviteSent([]);
    onClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      height={0.6}
      backgroundColor="#F8FAFC"
    >
      <Text style={iv.title}>Convidar para {group.name}</Text>
      <Text style={iv.subtitle}>{available.length} amigos disponíveis</Text>

      {available.length === 0 ? (
        <View style={iv.empty}>
          <Ionicons name="people-circle-outline" size={44} color="#CBD5E1" />
          <Text style={iv.emptyText}>
            Todos os seus amigos já estão no grupo!
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {available.map((f) => {
            const isSent = inviteSent.includes(f.id);
            return (
              <View key={f.id} style={iv.row}>
                <Image source={{ uri: f.foto }} style={iv.photo} />
                <View style={iv.info}>
                  <Text style={iv.name}>{f.nome}</Text>
                  <Text style={iv.username}>{f.username}</Text>
                </View>
                <TouchableOpacity
                  style={[iv.inviteBtn, isSent && iv.inviteBtnSent]}
                  onPress={() => setInviteSent((p) => [...p, f.id])}
                  disabled={isSent}
                >
                  <Ionicons
                    name={isSent ? "checkmark" : "paper-plane-outline"}
                    size={15}
                    color={isSent ? "#10B981" : "white"}
                  />
                  <Text
                    style={[iv.inviteBtnText, isSent && { color: "#10B981" }]}
                  >
                    {isSent ? "Enviado" : "Convidar"}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>
      )}
    </BottomSheetModal>
  );
}

const iv = StyleSheet.create({
  title: { fontSize: 20, fontWeight: "900", color: "#274c77", marginBottom: 2 },
  subtitle: { fontSize: 13, color: "#94A3B8", marginBottom: 16 },
  empty: { alignItems: "center", paddingVertical: 40, gap: 10 },
  emptyText: {
    fontSize: 14,
    color: "#CBD5E1",
    fontWeight: "600",
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  photo: { width: 46, height: 46, borderRadius: 23 },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: "#334155" },
  username: { fontSize: 12, color: "#94A3B8" },
  inviteBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#6096ba",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  inviteBtnSent: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
  },
  inviteBtnText: { fontSize: 13, fontWeight: "700", color: "white" },
});

// ─── Sheet: Confirmar saída / exclusão ───────────────────────────────────────

function DangerSheet({
  visible,
  onClose,
  group,
  onConfirm,
}: {
  visible: boolean;
  onClose: () => void;
  group: Group | null;
  onConfirm: () => void;
}) {
  const [confirm, setConfirm] = useState("");
  if (!group) return null;

  const isDelete = group.isAdmin;
  const keyword = isDelete ? "EXCLUIR" : "SAIR";
  const isReady = confirm.trim().toUpperCase() === keyword;

  const handleClose = () => {
    setConfirm("");
    onClose();
  };
  const handleConfirm = () => {
    onConfirm();
    handleClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      height={0.48}
      backgroundColor="#FFF5F5"
    >
      {/* Ícone de aviso */}
      <View style={dg.iconWrap}>
        <Ionicons
          name={isDelete ? "trash" : "exit"}
          size={28}
          color="#EF4444"
        />
      </View>

      <Text style={dg.title}>
        {isDelete ? "Excluir grupo?" : "Sair do grupo?"}
      </Text>
      <Text style={dg.desc}>
        {isDelete
          ? `"${group.name}" será excluído permanentemente para todos os membros. Esta ação não pode ser desfeita.`
          : `Você vai sair de "${group.name}". Poderá entrar novamente com o código.`}
      </Text>

      <Text style={dg.confirmLabel}>
        Digite <Text style={dg.keyword}>{keyword}</Text> para confirmar
      </Text>
      <TextInput
        style={[dg.input, isReady && dg.inputReady]}
        placeholder={keyword}
        placeholderTextColor="#FECACA"
        value={confirm}
        onChangeText={setConfirm}
        autoCapitalize="characters"
        autoFocus
      />

      <TouchableOpacity
        style={[dg.btn, !isReady && { opacity: 0.35 }]}
        disabled={!isReady}
        onPress={handleConfirm}
      >
        <Text style={dg.btnText}>
          {isDelete ? "Excluir grupo" : "Sair do grupo"}
        </Text>
      </TouchableOpacity>
    </BottomSheetModal>
  );
}

const dg = StyleSheet.create({
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  title: { fontSize: 20, fontWeight: "900", color: "#991B1B", marginBottom: 6 },
  desc: { fontSize: 13, color: "#64748B", lineHeight: 20, marginBottom: 20 },
  confirmLabel: { fontSize: 13, color: "#64748B", marginBottom: 8 },
  keyword: { fontWeight: "900", color: "#EF4444" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    fontSize: 18,
    fontWeight: "900",
    borderWidth: 1.5,
    borderColor: "#FECACA",
    color: "#EF4444",
    textAlign: "center",
    letterSpacing: 3,
    marginBottom: 14,
  },
  inputReady: { borderColor: "#EF4444", backgroundColor: "#FFF1F2" },
  btn: {
    backgroundColor: "#EF4444",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  btnText: { color: "white", fontWeight: "900", fontSize: 15 },
});

// ─── Sheet: Detalhe do grupo ──────────────────────────────────────────────────

function GroupDetailSheet({
  visible,
  onClose,
  group,
  friends,
  onGroupAction,
}: {
  visible: boolean;
  onClose: () => void;
  group: Group | null;
  friends: Friend[];
  onGroupAction: (action: "delete" | "leave", groupId: number) => void;
}) {
  const [activeReactionId, setActiveReactionId] = useState<string | null>(null);

  // Sub-sheets
  const [showShare, setShowShare] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showDanger, setShowDanger] = useState(false);

  if (!group) return null;

  const sorted = [...group.members].sort((a, b) => b.ml - a.ml);
  const available = friends.filter(
    (f) => f.status === "amigo" && !group.members.find((m) => m.id === f.id),
  );

  return (
    <>
      <BottomSheetModal
        visible={visible}
        onClose={onClose}
        height={0.88}
        backgroundColor="#F8FAFC"
      >
        {/* ── Header com paleta escura, distinta do ranking azul ── */}
        <LinearGradient colors={group.color} style={gd.headerGrad}>
          <View style={gd.headerTop}>
            <View style={{ flex: 1 }}>
              <Text style={gd.groupName}>{group.name}</Text>
              <View style={gd.avatarRow}>
                {group.members.slice(0, 5).map((m, i) => (
                  <Image
                    key={m.id}
                    source={{ uri: m.foto }}
                    style={[
                      gd.memberAvatar,
                      { marginLeft: i === 0 ? 0 : -8, zIndex: 5 - i },
                    ]}
                  />
                ))}
                <Text style={gd.memberCount}>
                  {" "}
                  {group.members.length} membros
                </Text>
              </View>
            </View>

            {/* Ações do header — cada botão tem função própria */}
            <View style={gd.actions}>
              {/* Compartilhar código */}
              <TouchableOpacity
                style={gd.actionBtn}
                onPress={() => setShowShare(true)}
              >
                <Ionicons name="share-social-outline" size={17} color="white" />
              </TouchableOpacity>

              {/* Convidar amigos — só admin */}
              {group.isAdmin && (
                <TouchableOpacity
                  style={[
                    gd.actionBtn,
                    available.length === 0 && { opacity: 0.4 },
                  ]}
                  disabled={available.length === 0}
                  onPress={() => setShowInvite(true)}
                >
                  <Ionicons name="person-add-outline" size={17} color="white" />
                </TouchableOpacity>
              )}

              {/* Sair / excluir */}
              <TouchableOpacity
                style={[gd.actionBtn, gd.actionBtnDanger]}
                onPress={() => setShowDanger(true)}
              >
                <Ionicons
                  name={group.isAdmin ? "trash-outline" : "exit-outline"}
                  size={17}
                  color="#FCA5A5"
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Pílulas de info */}
          <View style={gd.pillsRow}>
            {group.isAdmin && (
              <View style={gd.adminPill}>
                <Ionicons name="shield-checkmark" size={11} color="#FFD700" />
                <Text style={gd.adminPillText}>Admin</Text>
              </View>
            )}
            <View style={gd.codePill}>
              <Ionicons
                name="key-outline"
                size={11}
                color="rgba(255,255,255,0.7)"
              />
              <Text style={gd.codePillText}>{group.code}</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Ranking — exatamente igual à Home ── */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={gd.scroll}
        >
          <Text style={gd.sectionLabel}>RANKING DE HOJE</Text>
          {sorted.map((m, index) => (
            <RankItem
              key={m.id}
              position={index + 1}
              nome={m.nome}
              ml={m.ml}
              meta={m.meta}
              foto={m.foto}
              reactions={m.reactions || []}
              activeReactionId={activeReactionId}
              onOpenReaction={setActiveReactionId}
            />
          ))}
        </ScrollView>
      </BottomSheetModal>

      {/* Sub-sheets — renderizados fora do BottomSheetModal pai */}
      <ShareGroupSheet
        visible={showShare}
        onClose={() => setShowShare(false)}
        group={group}
      />
      <InviteToGroupSheet
        visible={showInvite}
        onClose={() => setShowInvite(false)}
        group={group}
        friends={friends}
      />
      <DangerSheet
        visible={showDanger}
        onClose={() => setShowDanger(false)}
        group={group}
        onConfirm={() =>
          onGroupAction(group.isAdmin ? "delete" : "leave", group.id)
        }
      />
    </>
  );
}

const gd = StyleSheet.create({
  headerGrad: { borderRadius: 20, padding: 16, marginBottom: 16 },
  headerTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 12,
  },
  groupName: {
    fontSize: 22,
    fontWeight: "900",
    color: "white",
    marginBottom: 8,
  },
  avatarRow: { flexDirection: "row", alignItems: "center" },
  memberAvatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
  },
  memberCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  actions: { flexDirection: "row", gap: 7, marginTop: 2 },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  actionBtnDanger: {
    backgroundColor: "rgba(239,68,68,0.2)",
    borderColor: "rgba(239,68,68,0.4)",
  },
  pillsRow: { flexDirection: "row", gap: 8 },
  adminPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  adminPillText: { fontSize: 11, color: "#FFD700", fontWeight: "700" },
  codePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  codePillText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "700",
    letterSpacing: 1,
  },
  scroll: { paddingBottom: 40 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
});

// ─── Sheet: Criar / Entrar em grupo ──────────────────────────────────────────

function GroupActionSheet({
  visible,
  onClose,
  onCreate,
}: {
  visible: boolean;
  onClose: () => void;
  onCreate: (name: string) => void;
}) {
  const [mode, setMode] = useState<"choose" | "criar" | "entrar">("choose");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const handleClose = () => {
    setMode("choose");
    setName("");
    setCode("");
    onClose();
  };

  return (
    <BottomSheetModal
      visible={visible}
      onClose={handleClose}
      height={0.48}
      backgroundColor="#F8FAFC"
    >
      {mode === "choose" && (
        <>
          <Text style={ga.title}>O que deseja fazer?</Text>
          <View style={ga.optionRow}>
            <TouchableOpacity style={ga.card} onPress={() => setMode("criar")}>
              <View style={[ga.iconWrap, { backgroundColor: "#EBF4FF" }]}>
                <Ionicons name="add-circle" size={32} color="#6096ba" />
              </View>
              <Text style={ga.cardLabel}>Criar grupo</Text>
              <Text style={ga.cardSub}>Seja o admin</Text>
            </TouchableOpacity>
            <TouchableOpacity style={ga.card} onPress={() => setMode("entrar")}>
              <View style={[ga.iconWrap, { backgroundColor: "#F0FDF4" }]}>
                <Ionicons name="enter" size={32} color="#10B981" />
              </View>
              <Text style={ga.cardLabel}>Entrar</Text>
              <Text style={ga.cardSub}>Tenho um código</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      {mode === "criar" && (
        <>
          <TouchableOpacity onPress={() => setMode("choose")} style={ga.back}>
            <Ionicons name="arrow-back" size={18} color="#6096ba" />
            <Text style={ga.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={ga.title}>Criar grupo</Text>
          <TextInput
            style={ga.input}
            placeholder="Nome do grupo..."
            value={name}
            onChangeText={setName}
            maxLength={30}
            autoFocus
          />
          <TouchableOpacity
            style={[ga.actionBtn, !name.trim() && { opacity: 0.4 }]}
            disabled={!name.trim()}
            onPress={() => {
              onCreate(name.trim());
              handleClose();
            }}
          >
            <Text style={ga.actionBtnText}>CRIAR</Text>
          </TouchableOpacity>
        </>
      )}
      {mode === "entrar" && (
        <>
          <TouchableOpacity onPress={() => setMode("choose")} style={ga.back}>
            <Ionicons name="arrow-back" size={18} color="#6096ba" />
            <Text style={ga.backText}>Voltar</Text>
          </TouchableOpacity>
          <Text style={ga.title}>Entrar com código</Text>
          <TextInput
            style={[ga.input, ga.codeInput]}
            placeholder="XXXXXX"
            value={code}
            onChangeText={(t) => setCode(t.toUpperCase())}
            maxLength={6}
            autoCapitalize="characters"
            autoFocus
          />
          <TouchableOpacity
            style={[
              ga.actionBtn,
              code.length < 6 && { opacity: 0.4 },
              { backgroundColor: "#10B981" },
            ]}
            disabled={code.length < 6}
            onPress={() => {
              Alert.alert("Entrou!", `Você entrou no grupo ${code}`);
              handleClose();
            }}
          >
            <Text style={ga.actionBtnText}>ENTRAR</Text>
          </TouchableOpacity>
        </>
      )}
    </BottomSheetModal>
  );
}

const ga = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: "#274c77",
    marginBottom: 20,
  },
  optionRow: { flexDirection: "row", gap: 12 },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "800",
    color: "#334155",
    textAlign: "center",
  },
  cardSub: { fontSize: 11, color: "#94A3B8", marginTop: 3 },
  back: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 14,
  },
  backText: { fontSize: 14, color: "#6096ba", fontWeight: "600" },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#334155",
    marginBottom: 14,
  },
  codeInput: {
    textAlign: "center",
    letterSpacing: 6,
    fontSize: 22,
    fontWeight: "900",
  },
  actionBtn: {
    backgroundColor: "#6096ba",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  actionBtnText: { color: "white", fontWeight: "900", fontSize: 16 },
});

// ─── Card de Atividade ────────────────────────────────────────────────────────

function ActivityCard({
  activity,
  friends,
}: {
  activity: Activity;
  friends: Friend[];
}) {
  const friend = friends.find((f) => f.id === activity.friendId);
  if (!friend) return null;
  const cfg = ACTIVITY_CONFIG[activity.type];
  return (
    <View style={fc.wrapper}>
      <View style={fc.timelineCol}>
        <LinearGradient colors={cfg.bg} style={fc.iconBubble}>
          <Ionicons name={cfg.icon as any} size={16} color="white" />
        </LinearGradient>
        <View style={fc.timelineLine} />
      </View>
      <View style={fc.card}>
        <View style={fc.cardHeader}>
          <Image source={{ uri: friend.foto }} style={fc.photo} />
          <View style={fc.cardInfo}>
            <Text style={fc.friendName}>{firstName(friend.nome)}</Text>
            <Text style={fc.activityText}>{cfg.label(activity.extra)}</Text>
          </View>
          <Text style={fc.time}>{activity.time}</Text>
        </View>
      </View>
    </View>
  );
}

const fc = StyleSheet.create({
  wrapper: { flexDirection: "row", gap: 12, marginBottom: 4 },
  timelineCol: { alignItems: "center", width: 32 },
  iconBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  timelineLine: {
    flex: 1,
    width: 2,
    backgroundColor: "#E2E8F0",
    marginTop: 4,
    marginBottom: -4,
  },
  card: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  photo: { width: 38, height: 38, borderRadius: 19 },
  cardInfo: { flex: 1 },
  friendName: { fontSize: 13, fontWeight: "800", color: "#274c77" },
  activityText: { fontSize: 13, color: "#334155", marginTop: 1 },
  time: { fontSize: 11, color: "#94A3B8", fontWeight: "600" },
});

// ─── Tela Principal ───────────────────────────────────────────────────────────

type SubTab = "feed" | "grupos";

export function CommunityScreen() {
  const [subTab, setSubTab] = useState<SubTab>("feed");
  const [friends, setFriends] = useState<Friend[]>(INITIAL_FRIENDS);
  const [groups, setGroups] = useState<Group[]>(INITIAL_GROUPS);
  const [showRequests, setShowRequests] = useState(false);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showGroupAction, setShowGroupAction] = useState(false);

  const pendingCount = friends.filter(
    (f) => f.status === "pendente_recebido",
  ).length;
  const confirmedFriends = friends.filter((f) => f.status === "amigo");

  const handleAccept = (id: number) =>
    setFriends((p) =>
      p.map((f) => (f.id === id ? { ...f, status: "amigo" } : f)),
    );
  const handleReject = (id: number) =>
    setFriends((p) => p.filter((f) => f.id !== id));
  const handleGroupAction = (_: "delete" | "leave", groupId: number) => {
    setGroups((p) => p.filter((g) => g.id !== groupId));
    setSelectedGroup(null);
  };
  const handleCreateGroup = (name: string) => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const palette = GROUP_PALETTES[groups.length % GROUP_PALETTES.length];
    setGroups((p) => [
      ...p,
      {
        id: Date.now(),
        name,
        code,
        isAdmin: true,
        color: palette,
        members: [
          {
            id: 1,
            nome: "Luana Castro",
            foto: "https://i.pravatar.cc/300?img=32",
            ml: 2850,
            meta: 2500,
            reactions: [],
          },
        ],
      },
    ]);
  };

  return (
    <View style={s.root}>
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={s.header}>
        <View>
          <Text style={s.title}>Comunidade</Text>
          <Text style={s.subtitle}>Amigos e grupos 💧</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity
            style={s.iconBtn}
            onPress={() => setShowRequests(true)}
          >
            <Ionicons name="notifications-outline" size={22} color="#334155" />
            {pendingCount > 0 && (
              <View style={s.badge}>
                <Text style={s.badgeText}>{pendingCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() =>
              subTab === "feed"
                ? setShowAddFriend(true)
                : setShowGroupAction(true)
            }
          >
            <Ionicons name="add" size={22} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Tabs ───────────────────────────────────────────────────────── */}
      <View style={s.tabRow}>
        {(["feed", "grupos"] as SubTab[]).map((tab) => {
          const active = subTab === tab;
          const count =
            tab === "grupos" ? groups.length : confirmedFriends.length;
          return (
            <TouchableOpacity
              key={tab}
              style={[s.tab, active && s.tabActive]}
              onPress={() => setSubTab(tab)}
            >
              <Ionicons
                name={tab === "feed" ? "flash" : "people"}
                size={14}
                color={active ? "white" : "#6096ba"}
              />
              <Text style={[s.tabText, active && s.tabTextActive]}>
                {tab === "feed" ? "Feed" : "Grupos"}
              </Text>
              {count > 0 && (
                <View style={[s.pill, active && s.pillActive]}>
                  <Text style={[s.pillText, active && s.pillTextActive]}>
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Feed ───────────────────────────────────────────────────────── */}
      {subTab === "feed" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
        >
          {confirmedFriends.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>⚡️</Text>
              <Text style={s.emptyTitle}>Feed vazio</Text>
              <Text style={s.emptyDesc}>
                Adicione amigos para ver as novidades
              </Text>
            </View>
          ) : (
            <>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.stripContent}
              >
                {confirmedFriends.map((f) => (
                  <View key={f.id} style={s.stripItem}>
                    <View style={s.stripWrap}>
                      <Image source={{ uri: f.foto }} style={s.stripAvatar} />
                      {f.ml >= f.meta && <View style={s.stripDot} />}
                    </View>
                    <Text style={s.stripName} numberOfLines={1}>
                      {firstName(f.nome)}
                    </Text>
                  </View>
                ))}
              </ScrollView>
              <Text style={s.feedLabel}>ATIVIDADES RECENTES</Text>
              {FEED.filter((a) =>
                confirmedFriends.find((f) => f.id === a.friendId),
              ).map((activity) => (
                <ActivityCard
                  key={activity.id}
                  activity={activity}
                  friends={confirmedFriends}
                />
              ))}
              <View style={s.timelineEnd}>
                <Ionicons
                  name="ellipsis-horizontal"
                  size={16}
                  color="#CBD5E1"
                />
              </View>
            </>
          )}
        </ScrollView>
      )}

      {/* ── Grupos ─────────────────────────────────────────────────────── */}
      {subTab === "grupos" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
        >
          {groups.length === 0 ? (
            <View style={s.empty}>
              <Text style={s.emptyEmoji}>🏆</Text>
              <Text style={s.emptyTitle}>Sem grupos ainda</Text>
              <Text style={s.emptyDesc}>Toque em + para criar ou entrar</Text>
            </View>
          ) : (
            groups.map((group) => {
              const leader = [...group.members].sort((a, b) => b.ml - a.ml)[0];
              return (
                <TouchableOpacity
                  key={group.id}
                  style={s.groupCard}
                  onPress={() => setSelectedGroup(group)}
                  activeOpacity={0.88}
                >
                  <LinearGradient colors={group.color} style={s.groupGrad}>
                    <View style={s.groupTop}>
                      <View style={{ flex: 1 }}>
                        <Text style={s.groupName}>{group.name}</Text>
                        <View style={s.groupAvatars}>
                          {group.members.slice(0, 5).map((m, i) => (
                            <Image
                              key={m.id}
                              source={{ uri: m.foto }}
                              style={[
                                s.groupAvatar,
                                { marginLeft: i === 0 ? 0 : -7, zIndex: 5 - i },
                              ]}
                            />
                          ))}
                          <Text style={s.groupCount}>
                            {" "}
                            {group.members.length} membros
                          </Text>
                        </View>
                      </View>
                      <View style={s.groupRight}>
                        {group.isAdmin && (
                          <View style={s.adminPill}>
                            <Ionicons
                              name="shield-checkmark"
                              size={10}
                              color="#FFD700"
                            />
                            <Text style={s.adminText}>Admin</Text>
                          </View>
                        )}
                        <Ionicons
                          name="chevron-forward"
                          size={18}
                          color="rgba(255,255,255,0.5)"
                        />
                      </View>
                    </View>
                    <Text style={s.groupLeader}>
                      🥇 {firstName(leader.nome)} · {leader.ml}ml
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              );
            })
          )}
        </ScrollView>
      )}

      {/* ── Sheets ─────────────────────────────────────────────────────── */}
      <RequestsSheet
        visible={showRequests}
        onClose={() => setShowRequests(false)}
        friends={friends}
        onAccept={handleAccept}
        onReject={handleReject}
      />
      <AddFriendSheet
        visible={showAddFriend}
        onClose={() => setShowAddFriend(false)}
      />
      <GroupDetailSheet
        visible={selectedGroup !== null}
        onClose={() => setSelectedGroup(null)}
        group={selectedGroup}
        friends={friends}
        onGroupAction={handleGroupAction}
      />
      <GroupActionSheet
        visible={showGroupAction}
        onClose={() => setShowGroupAction(false)}
        onCreate={handleCreateGroup}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: { fontSize: 26, fontWeight: "900", color: "#274c77" },
  subtitle: { fontSize: 13, color: "#8b8c89", fontWeight: "500" },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 4,
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#EF4444",
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  badgeText: { fontSize: 10, fontWeight: "900", color: "white" },
  addBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "#6096ba",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    shadowColor: "#6096ba",
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 10,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#EBF4FF",
    borderWidth: 1.5,
    borderColor: "#BFDBFE",
  },
  tabActive: {
    backgroundColor: "#6096ba",
    borderColor: "#6096ba",
    elevation: 4,
    shadowColor: "#6096ba",
    shadowOpacity: 0.25,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  tabText: { fontSize: 14, fontWeight: "800", color: "#6096ba" },
  tabTextActive: { color: "white" },
  pill: {
    backgroundColor: "#BFDBFE",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  pillActive: { backgroundColor: "rgba(255,255,255,0.3)" },
  pillText: { fontSize: 11, fontWeight: "900", color: "#6096ba" },
  pillTextActive: { color: "white" },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  empty: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyEmoji: { fontSize: 48 },
  emptyTitle: { fontSize: 18, fontWeight: "900", color: "#CBD5E1" },
  emptyDesc: { fontSize: 13, color: "#CBD5E1" },
  stripContent: { paddingBottom: 16, paddingTop: 4, gap: 14, paddingRight: 4 },
  stripItem: { alignItems: "center", width: 56 },
  stripWrap: { position: "relative", marginBottom: 5 },
  stripAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  stripDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: "#10B981",
    borderWidth: 2,
    borderColor: "#F8FAFC",
  },
  stripName: {
    fontSize: 11,
    fontWeight: "600",
    color: "#64748B",
    maxWidth: 54,
    textAlign: "center",
  },
  feedLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: "#94A3B8",
    letterSpacing: 1.2,
    marginBottom: 16,
  },
  timelineEnd: { alignItems: "center", paddingVertical: 8, marginLeft: 15 },
  groupCard: {
    borderRadius: 20,
    marginBottom: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  groupGrad: { padding: 16 },
  groupTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  groupName: {
    fontSize: 18,
    fontWeight: "900",
    color: "white",
    marginBottom: 6,
  },
  groupAvatars: { flexDirection: "row", alignItems: "center" },
  groupAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.5)",
  },
  groupCount: {
    fontSize: 11,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  groupRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  adminPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  adminText: { fontSize: 10, color: "#FFD700", fontWeight: "700" },
  groupLeader: {
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    fontWeight: "600",
  },
});
