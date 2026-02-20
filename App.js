import React, { useState } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { AppProvider, useApp } from "./src/context/AppContext";
import { LoginScreen } from "./src/screens/LoginScreen";
import { BottomTabs } from "./src/components/BottomTabs";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CommunityScreen } from "./src/screens/CommunityScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

// ─── Raiz: só adiciona o Provider ────────────────────────────────────────────

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  );
}

// ─── Shell: decide o que renderizar ──────────────────────────────────────────

function Shell() {
  const {
    isLoggedIn,
    isLoadingAuth,
    todayMl,
    meta,
    addWater,
    changeMeta,
    user,
  } = useApp();
  const [activeTab, setActiveTab] = useState("home");

  // 1. Verificando sessão salva → spinner centralizado
  if (isLoadingAuth) {
    return (
      <View style={st.loading}>
        <ActivityIndicator size="large" color="#6096ba" />
      </View>
    );
  }

  // 2. Não logado → tela de login/registro
  if (!isLoggedIn) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
          <LoginScreen />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // 3. Logado → app normal (idêntico ao que você já tem, só com dados reais)
  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            mlConsumido={todayMl}
            meta={meta}
            onAddWater={addWater} // ← agora chama POST /api/water
            onMetaChange={changeMeta} // ← agora chama PATCH /api/auth/me
          />
        );
      case "groups":
        return <CommunityScreen />;
      case "stats":
        return <StatsScreen meta={meta} />;
      case "profile":
        return (
          <ProfileScreen
            userName={user?.name ?? ""}
            userPhoto={user?.photoUrl ?? undefined}
            ml={todayMl}
            meta={meta}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={st.container}>
        <View style={st.screen}>{renderScreen()}</View>
        <BottomTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const st = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  screen: { flex: 1 },
});
