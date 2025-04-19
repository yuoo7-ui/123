import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../firebase-config'; // Firebase 설정 파일 import
import { onAuthStateChanged, signOut } from 'firebase/auth';

const HeaderButtons = () => {
  const [user, setUser] = useState(null);
  const navigation = useNavigation();

  // Firebase 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // 컴포넌트 언마운트 시 구독 해제
  }, []);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <View style={styles.headerButtons}>
      {user ? (
        <>
          <Text style={styles.email}>{user.email}</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.headerButton}>로그아웃</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.headerButton}>로그인</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.headerButton}>회원가입</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerButtons: { flexDirection: 'row', justifyContent: 'flex-end', padding: 10 },
  headerButton: { fontSize: 16, color: '#1a73e8', marginLeft: 10 },
  email: { fontSize: 16, color: '#000', marginRight: 10 },
});

export default HeaderButtons;
