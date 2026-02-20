import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../context/AppContext";

type Mode = "login" | "register";

export function LoginScreen() {
  const { login, register } = useApp();

  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [goal, setGoal] = useState("2500");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const toggle = () => {
    setMode((m) => (m === "login" ? "register" : "login"));
    setName("");
    setEmail("");
    setPassword("");
    setGoal("2500");
  };

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Atenção", "Preencha e-mail e senha.");
      return;
    }
    if (mode === "register" && !name.trim()) {
      Alert.alert("Atenção", "Preencha seu nome.");
      return;
    }

    setLoading(true);

    // Criamos um timeout para não carregar infinitamente se a API estiver fora do ar
    const loginTimeout = new Promise((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Servidor demorou muito a responder. Verifique sua conexão.",
            ),
          ),
        8000,
      ),
    );

    try {
      if (mode === "login") {
        // Race entre a API e o Timeout
        await Promise.race([login(email.trim(), password), loginTimeout]);
      } else {
        await Promise.race([
          register(name.trim(), email.trim(), password, Number(goal) || 2500),
          loginTimeout,
        ]);
      }
    } catch (err: any) {
      Alert.alert("Erro", err.message ?? "Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={st.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <LinearGradient colors={["#274c77", "#6096ba"]} style={st.hero}>
          <Text style={st.heroEmoji}>💧</Text>
          <Text style={st.heroTitle}>VERSUS</Text>
          <Text style={st.heroSub}>Hidrate. Compita. Vença.</Text>
        </LinearGradient>

        <View style={st.card}>
          <Text style={st.cardTitle}>
            {mode === "login" ? "Entrar na conta" : "Criar conta"}
          </Text>

          {mode === "register" && (
            <View style={st.field}>
              <Text style={st.label}>Nome</Text>
              <TextInput
                style={st.input}
                placeholder="Seu nome"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
              />
            </View>
          )}

          <View style={st.field}>
            <Text style={st.label}>E-mail</Text>
            <TextInput
              style={st.input}
              placeholder="seu@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={st.field}>
            <Text style={st.label}>Senha</Text>
            <View style={st.row}>
              <TextInput
                style={[st.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Mínimo 6 caracteres"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
              />
              <TouchableOpacity
                style={st.eyeBtn}
                onPress={() => setShowPass((v) => !v)}
              >
                <Ionicons
                  name={showPass ? "eye-off" : "eye"}
                  size={20}
                  color="#94A3B8"
                />
              </TouchableOpacity>
            </View>
          </View>

          {mode === "register" && (
            <View style={st.field}>
              <Text style={st.label}>Meta diária (ml)</Text>
              <TextInput
                style={st.input}
                placeholder="2500"
                value={goal}
                onChangeText={setGoal}
                keyboardType="numeric"
              />
            </View>
          )}

          <TouchableOpacity
            style={[st.btn, loading && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.85}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={st.btnText}>
                {mode === "login" ? "ENTRAR" : "CRIAR CONTA"}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={st.toggle} onPress={toggle}>
            <Text style={st.toggleText}>
              {mode === "login" ? "Não tem conta? " : "Já tem conta? "}
              <Text style={st.toggleLink}>
                {mode === "login" ? "Criar agora" : "Entrar"}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const st = StyleSheet.create({
  scroll: { flexGrow: 1, backgroundColor: "#F8FAFC" },
  hero: { paddingTop: 80, paddingBottom: 52, alignItems: "center", gap: 8 },
  heroEmoji: { fontSize: 56 },
  heroTitle: {
    fontSize: 42,
    fontWeight: "900",
    color: "white",
    letterSpacing: 2,
    fontStyle: "italic", // Adicionado para combinar com a marca VERSUS
  },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.75)", fontWeight: "500" },
  card: {
    flex: 1,
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -28,
    padding: 28,
    paddingBottom: 52,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#274c77",
    marginBottom: 20,
  },
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: "700", color: "#64748B", marginBottom: 6 },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    fontSize: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#334155",
  },
  row: { flexDirection: "row", gap: 8 },
  eyeBtn: {
    padding: 16,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
  },
  btn: {
    backgroundColor: "#6096ba",
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    marginTop: 8,
  },
  btnText: {
    color: "white",
    fontWeight: "900",
    fontSize: 16,
    letterSpacing: 1,
  },
  toggle: { alignItems: "center", marginTop: 18 },
  toggleText: { fontSize: 14, color: "#64748B" },
  toggleLink: { color: "#6096ba", fontWeight: "800" },
});
