import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { BottomTabs } from "./src/components/BottomTabs";
import { HomeScreen } from "./src/screens/HomeScreen";
import { CommunityScreen } from "./src/screens/CommunityScreen";
import { StatsScreen } from "./src/screens/StatsScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";

export default function App() {
  const [activeTab, setActiveTab] = useState("home");

  // Estado global compartilhado entre telas
  const [mlConsumido, setMlConsumido] = useState(200);
  const [meta, setMeta] = useState(2500);

  const handleAddWater = (quantidade) => {
    setMlConsumido((prev) => prev + quantidade);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case "home":
        return (
          <HomeScreen
            mlConsumido={mlConsumido}
            meta={meta}
            onAddWater={handleAddWater}
            onMetaChange={setMeta}
          />
        );
      case "groups":
        return <CommunityScreen />;
      case "stats":
        return <StatsScreen meta={meta} />;
      case "profile":
        return (
          <ProfileScreen
            userName="Luana Castro"
            userPhoto="https://i.pravatar.cc/300?img=32"
            ml={mlConsumido}
            meta={meta}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.screenContainer}>{renderScreen()}</View>
        <BottomTabs activeTab={activeTab} onChangeTab={setActiveTab} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  screenContainer: {
    flex: 1,
  },
});
