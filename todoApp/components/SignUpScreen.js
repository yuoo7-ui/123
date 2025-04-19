import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase-config";
import { getFirestore, setDoc, doc } from "firebase/firestore";
import { Picker } from '@react-native-picker/picker';

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [petName, setPetName] = useState('');
  const [petType, setPetType] = useState('개');      // ✅ 기본값: 개
  const [petSize, setPetSize] = useState('소형');    // 기본값: 소형

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const db = getFirestore();
      await setDoc(doc(db, "users", userCredential.user.uid), {
        petName,
        petType,
        petSize,
        email,
      });
      Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
    } catch (error) {
      console.error("회원가입 오류:", error.message);
      Alert.alert("회원가입 실패", error.message);
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
      <TextInput
        placeholder="비밀번호 확인"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={styles.input}
      />
      <TextInput
        placeholder="반려동물 이름"
        value={petName}
        onChangeText={setPetName}
        style={styles.input}
      />

      {/* ✅ 반려동물 종류 선택 Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>반려동물 종류</Text>
        <Picker
          selectedValue={petType}
          onValueChange={(itemValue) => setPetType(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="개" value="개" />
          <Picker.Item label="고양이" value="고양이" />
          <Picker.Item label="기타" value="기타" />
        </Picker>
      </View>

      {/* 반려동물 크기 Picker */}
      <View style={styles.pickerContainer}>
        <Text style={styles.label}>반려동물 크기</Text>
        <Picker
          selectedValue={petSize}
          onValueChange={(itemValue) => setPetSize(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="소형" value="소형" />
          <Picker.Item label="중형" value="중형" />
          <Picker.Item label="대형" value="대형" />
        </Picker>
      </View>

      <Button title="회원가입" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate("Login")} style={styles.loginText}>
        로그인
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  loginText: {
    color: "blue",
    marginTop: 10,
  },
  pickerContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default SignUpScreen;
