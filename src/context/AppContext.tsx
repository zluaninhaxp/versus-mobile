// src/context/AppContext.tsx
// Estado global do app — substitui os useState espalhados no App.js

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { api, User, getToken } from "../api/client";

interface AppState {
  // Autenticação
  user:          User | null;
  isLoadingAuth: boolean;        // true enquanto verifica sessão salva
  isLoggedIn:    boolean;

  // Água do dia (estado vivo, atualizado a cada registro)
  todayMl: number;
  meta:    number;

  // Ações — todas async, chamam a API
  login:        (email: string, password: string) => Promise<void>;
  register:     (name: string, email: string, password: string, dailyGoal?: number) => Promise<void>;
  logout:       () => Promise<void>;
  addWater:     (ml: number) => Promise<void>;
  changeMeta:   (ml: number) => Promise<void>;
  refreshWater: () => Promise<void>;
}

const AppContext = createContext<AppState | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user,          setUser]          = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);
  const [todayMl,       setTodayMl]       = useState(0);

  const meta = user?.dailyGoal ?? 2500;

  // ── Ao abrir o app: verificar se há sessão salva ───────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const token = await getToken();
        if (!token) return;                      // sem token → vai para login

        // Token existe → buscar dados em paralelo
        const [{ user: me }, { total }] = await Promise.all([
          api.auth.me(),
          api.water.today(),
        ]);
        setUser(me);
        setTodayMl(total);
      } catch {
        // Token expirado ou inválido → ignora, cai no login
      } finally {
        setIsLoadingAuth(false);
      }
    })();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: me } = await api.auth.login(email, password);
    setUser(me);
    const { total } = await api.water.today();
    setTodayMl(total);
  }, []);

  const register = useCallback(async (
    name: string, email: string, password: string, dailyGoal = 2500
  ) => {
    const { user: me } = await api.auth.register({ name, email, password, dailyGoal });
    setUser(me);
    setTodayMl(0);
  }, []);

  const logout = useCallback(async () => {
    await api.auth.logout();
    setUser(null);
    setTodayMl(0);
  }, []);

  const addWater = useCallback(async (ml: number) => {
    const { todayTotal } = await api.water.add(ml);
    setTodayMl(todayTotal);   // backend retorna o total real — sem inconsistência
  }, []);

  const changeMeta = useCallback(async (dailyGoal: number) => {
    const { user: updated } = await api.auth.updateMe({ dailyGoal });
    setUser(updated);
  }, []);

  const refreshWater = useCallback(async () => {
    const { total } = await api.water.today();
    setTodayMl(total);
  }, []);

  return (
    <AppContext.Provider value={{
      user, isLoadingAuth, isLoggedIn: !!user,
      todayMl, meta,
      login, register, logout, addWater, changeMeta, refreshWater,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return ctx;
}
