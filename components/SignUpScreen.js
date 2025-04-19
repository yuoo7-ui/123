import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // ✅ Picker import
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebase-config";
import { doc, setDoc } from "firebase/firestore";

const SignUpScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [petType, setPetType] = useState('개');
  const [petExperience, setPetExperience] = useState('1년 미만');
  const [walkTime, setWalkTime] = useState('15분 이하');

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("오류", "비밀번호가 일치하지 않습니다.");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 사용자 추가 정보 Firestore에 저장
      await setDoc(doc(db, "users", user.uid), {
        email: email,
        petType: petType,
        petExperience: petExperience,
        walkTime: walkTime,
        createdAt: new Date()
      });

      Alert.alert("회원가입 성공", "회원가입이 완료되었습니다.");
      navigation.navigate("Login");
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

      <Text style={styles.label}>반려동물 종류</Text>
      <Picker
        selectedValue={petType}
        onValueChange={(itemValue) => setPetType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="개" value="개" />
        <Picker.Item label="고양이" value="고양이" />
        <Picker.Item label="기타" value="기타" />
        <Picker.Item label="없음" value="없음" />
      </Picker>

      <Text style={styles.label}>반려동물 경험 기간</Text>
      <Picker
        selectedValue={petExperience}
        onValueChange={(itemValue) => setPetExperience(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="1년 미만" value="1년 미만" />
        <Picker.Item label="1~3년" value="1~3년" />
        <Picker.Item label="3년 이상" value="3년 이상" />
      </Picker>

      <Text style={styles.label}>하루 평균 산책 시간</Text>
      <Picker
        selectedValue={walkTime}
        onValueChange={(itemValue) => setWalkTime(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="15분 이하" value="15분 이하" />
        <Picker.Item label="15~30분" value="15~30분" />
        <Picker.Item label="30분 이상" value="30분 이상" />
      </Picker>

      <Button title="회원가입" onPress={handleSignup} />
      <Text onPress={() => navigation.navigate("Login")} style={styles.loginLink}>
        로그인
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  input: {
    marginBottom: 10,
    padding: 8,
    borderWidth: 1,
    borderRadius: 4
  },
  picker: {
    marginBottom: 15
  },
  label: {
    marginTop: 10,
    marginBottom: 5,
    fontWeight: 'bold'
  },
  loginLink: {
    color: "blue",
    marginTop: 10,
    textAlign: 'center'
  }
});

export default SignUpScreen;
