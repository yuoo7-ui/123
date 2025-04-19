import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '../firebase-config'; // Firebase 설정 가져오기

export default function ButlerScreen() {
  const [petName, setPetName] = useState('없음');
  const [petType, setPetType] = useState('없음');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPetData = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          console.log("로그인한 사용자 UID:", user.uid); // 로그인한 사용자 UID 확인
          const db = getFirestore();
          const docRef = doc(db, "users", user.uid);  // Firestore에서 해당 사용자 문서 참조
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const data = docSnap.data();
            console.log("불러온 데이터:", data); // Firestore에서 불러온 데이터 확인
            setPetName(data.petName || '이름 없음');
            setPetType(data.petType || '종류 없음');
          } else {
            console.log("해당 사용자 문서가 존재하지 않습니다.");
          }
        } catch (error) {
          console.error("Error getting document:", error);
        }
      }
      setLoading(false);
    };

    fetchPetData();
  }, []);

  if (loading) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.centeredView}>
          <ActivityIndicator size="large" color="#0000ff" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.header}>반려동물 정보</Text>
          <Text style={styles.modalText}>반려동물 이름: {petName}</Text>
          <Text style={styles.modalText}>반려동물 종류: {petType}</Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  textInput: {    
    borderColor: '#000000',
    borderBottomWidth: 1,
    marginBottom: 36,
    width: 300,
  },
  header: {
    color: 'gray',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 26,
    marginBottom: 58,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 125,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
  },
});
