// AccountInfoScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase-config'; // Firebase Firestore 설정 가져오기

export default function AccountInfoScreen() {
  const [userInfo, setUserInfo] = useState(null); // 사용자 정보 상태
  const [loading, setLoading] = useState(true); // 로딩 상태

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Firestore에서 현재 로그인한 사용자 정보 가져오기
        const userRef = doc(db, 'users', auth.currentUser.uid); // 사용자 문서 참조
        const userDoc = await getDoc(userRef); // 문서 가져오기

        if (userDoc.exists()) {
          // 데이터가 있으면 상태 업데이트
          setUserInfo(userDoc.data());
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.log('Error fetching user data: ', error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchUserInfo(); // 사용자 정보 가져오기
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {userInfo ? (
        <>
          <Text style={styles.text}>이메일: {auth.currentUser.email}</Text>
          <Text style={styles.text}>반려동물 이름: {userInfo.petName || '없음'}</Text>
          <Text style={styles.text}>반려동물 종류: {userInfo.petType || '없음'}</Text>
        </>
      ) : (
        <Text style={styles.text}>사용자 정보가 없습니다.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
  },
});
