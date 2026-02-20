import AsyncStorage from "@react-native-async-storage/async-storage";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURAÇÃO
// ─────────────────────────────────────────────────────────────────────────────
const BASE_URL = __DEV__
  ? "http://192.168.0.174:3000/api" // ← Certifique-se que este ainda é seu IP
  : "https://sua-url.railway.app/api";

const TOKEN_KEY = "@versus:token";

// ─── Fetch central com Timeout corrigido ─────────────────────────────────────

export async function apiFetch<T = any>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = await AsyncStorage.getItem(TOKEN_KEY);

  // AbortController para evitar o carregamento infinito
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de limite

  try {
    const res = await fetch(BASE_URL + path, {
      ...options,
      signal: controller.signal, // Vincula o sinal de cancelamento
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {}),
      },
    });

    clearTimeout(timeoutId); // Sucesso: limpa o timer

    const data = await res.json();
    if (!res.ok) throw new Error(data.error ?? `Erro ${res.status}`);
    return data;
  } catch (error: any) {
    clearTimeout(timeoutId);

    // Tratamento amigável para erro de conexão/timeout
    if (error.name === "AbortError") {
      throw new Error(
        "Servidor demorou muito para responder. Verifique sua conexão e o IP.",
      );
    }
    throw error;
  }
}

export const saveToken = (t: string) => AsyncStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => AsyncStorage.removeItem(TOKEN_KEY);
export const getToken = () => AsyncStorage.getItem(TOKEN_KEY);

// ─── API organizada por domínio ───────────────────────────────────────────────

export const api = {
  auth: {
    register: (body: {
      name: string;
      email: string;
      password: string;
      dailyGoal?: number;
    }) =>
      apiFetch<{ token: string; user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify(body),
      }),

    login: async (email: string, password: string) => {
      const data = await apiFetch<{ token: string; user: User }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      );
      await saveToken(data.token);
      return data;
    },

    logout: clearToken,
    me: () => apiFetch<{ user: User }>("/auth/me"),
    updateMe: (
      body: Partial<Pick<User, "name" | "avatarId" | "photoUrl" | "dailyGoal">>,
    ) =>
      apiFetch<{ user: User }>("/auth/me", {
        method: "PATCH",
        body: JSON.stringify(body),
      }),
  },

  water: {
    add: (ml: number) =>
      apiFetch<{ entry: WaterEntry; todayTotal: number }>("/water", {
        method: "POST",
        body: JSON.stringify({ ml }),
      }),
    today: () =>
      apiFetch<{ total: number; entries: WaterEntry[] }>("/water/today"),
    history: (days = 7) =>
      apiFetch<{ history: { date: string; ml: number }[] }>(
        `/water/history?days=${days}`,
      ),
    delete: (id: string) => apiFetch(`/water/${id}`, { method: "DELETE" }),
  },

  groups: {
    list: () => apiFetch<{ groups: Group[] }>("/groups"),
    create: (name: string, paletteId: string) =>
      apiFetch<{ group: Group }>("/groups", {
        method: "POST",
        body: JSON.stringify({ name, paletteId }),
      }),
    join: (code: string) =>
      apiFetch<{ group: Group }>("/groups/join", {
        method: "POST",
        body: JSON.stringify({ code }),
      }),
    ranking: (groupId: string) =>
      apiFetch<{ ranking: RankingMember[] }>(`/groups/${groupId}/ranking`),
    invite: (groupId: string, userId: string) =>
      apiFetch(`/groups/${groupId}/invite`, {
        method: "POST",
        body: JSON.stringify({ userId }),
      }),
    update: (groupId: string, body: { name?: string; paletteId?: string }) =>
      apiFetch<{ group: Group }>(`/groups/${groupId}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    delete: (groupId: string) =>
      apiFetch(`/groups/${groupId}`, { method: "DELETE" }),
    leave: (groupId: string) =>
      apiFetch(`/groups/${groupId}/leave`, { method: "DELETE" }),
  },

  friends: {
    list: () => apiFetch<{ friends: FriendWithMl[] }>("/friends"),
    requests: () =>
      apiFetch<{ received: FriendRequest[]; sent: FriendRequest[] }>(
        "/friends/requests",
      ),
    search: (q: string) =>
      apiFetch<{ results: SearchResult[] }>(
        `/friends/search?q=${encodeURIComponent(q)}`,
      ),
    sendRequest: (toUserId: string) =>
      apiFetch("/friends/request", {
        method: "POST",
        body: JSON.stringify({ toUserId }),
      }),
    accept: (id: string) =>
      apiFetch(`/friends/accept/${id}`, { method: "POST" }),
    reject: (id: string) =>
      apiFetch(`/friends/reject/${id}`, { method: "DELETE" }),
    remove: (id: string) => apiFetch(`/friends/${id}`, { method: "DELETE" }),
  },

  reactions: {
    react: (toUserId: string, emoji: string) =>
      apiFetch("/reactions", {
        method: "POST",
        body: JSON.stringify({ toUserId, emoji }),
      }),
    remove: (toUserId: string) =>
      apiFetch(`/reactions/${toUserId}`, { method: "DELETE" }),
    forGroup: (groupId: string) =>
      apiFetch<{
        reactions: GroupReactions[];
        myReactions: Record<string, string>;
      }>(`/reactions/group/${groupId}`),
  },
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  avatarId: number;
  photoUrl?: string;
  dailyGoal: number;
  createdAt?: string;
}
export interface WaterEntry {
  id: string;
  userId: string;
  ml: number;
  recordedAt: string;
}
export interface Group {
  id: string;
  name: string;
  code: string;
  paletteId: string;
  myRole: "ADMIN" | "MEMBER";
  members: {
    id: string;
    userId: string;
    role: string;
    user: Pick<User, "id" | "name" | "username" | "avatarId" | "photoUrl">;
  }[];
}
export interface RankingMember {
  userId: string;
  name: string;
  username: string;
  avatarId: number;
  photoUrl?: string;
  dailyGoal: number;
  totalMl: number;
  position: number;
}
export interface FriendWithMl {
  friendshipId: string;
  id: string;
  name: string;
  username: string;
  avatarId: number;
  photoUrl?: string;
  dailyGoal: number;
  todayMl: number;
}
export interface FriendRequest {
  id: string;
  user: Pick<User, "id" | "name" | "username" | "avatarId" | "photoUrl">;
  createdAt: string;
}
export interface SearchResult extends Pick<
  User,
  "id" | "name" | "username" | "avatarId" | "photoUrl"
> {
  relationStatus: "none" | "friend" | "sent" | "received";
}
export interface GroupReactions {
  userId: string;
  reactions: { emoji: string; count: number }[];
}
