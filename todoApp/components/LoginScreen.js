import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("로그인 성공:", userCredential.user);
      Alert.alert("로그인 성공", "환영합니다!");
      // 로그인 성공하면 App.js에서 onAuthStateChanged에 의해 메인으로 이동됨
    } catch (error) {
      console.error("로그인 오류:", error.message);
      Alert.alert("로그인 실패", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="이메일"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        style={styles.input}
      />
      <TextInput
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={styles.input}
      />
      <Button title="로그인" onPress={handleLogin} />
      <Text onPress={() => navigation.navigate("SignUp")} style={styles.signupText}>
        회원가입
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // ⬅️ 수직 가운데
    alignItems: 'center',     // ⬅️ 수평 가운데
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    width: '100%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
  },
  signupText: {
    color: "blue",
    marginTop: 10,
  },
});

export default LoginScreen;
