// MyPageScreen.js
import { Text, View, Pressable, StyleSheet } from 'react-native';
import React from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Octicons from '@expo/vector-icons/Octicons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import HeaderButtons from '../components/HeaderButtons'; // HeaderButtons import
import { useNavigation } from '@react-navigation/native'; // useNavigation import

export default function MyPageScreen() {
  const navigation = useNavigation(); // 네비게이션 훅 사용

  return (
    <View style={{ flex: 1 }}>
      {/* HeaderButtons를 상단에 추가 */}
      <HeaderButtons />

      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 20 }}>
        {/* 내 반려동물 버튼 */}
        <Pressable onPress={() => navigation.navigate('집사정보')}>
          <Text
            style={{
              fontSize: 17,
              padding: 10,
              backgroundColor: '#fff',
              borderRadius: 10,
              borderWidth: 1,
              width: 405,
              height: 50,
              textAlign: 'center',
              lineHeight: 30,
            }}
          >
            <MaterialIcons name="pets" size={24} color="black" /> 내 반려동물
          </Text>
        </Pressable>

        <Text
          style={{
            fontSize: 17,
            padding: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            width: 405,
            height: 50,
            textAlign: 'center',
            lineHeight: 30,
            marginTop: 10,
          }}
        >
          <MaterialCommunityIcons name="information-outline" size={24} color="black" /> 계정 정보
        </Text>

        <Text
          style={{
            fontSize: 17,
            padding: 10,
            backgroundColor: '#fff',
            borderRadius: 10,
            borderWidth: 1,
            width: 405,
            height: 50,
            textAlign: 'center',
            lineHeight: 30,
            marginTop: 10,
          }}
        >
          <Octicons name="bell" size={24} color="black" /> 문의하기
        </Text>
      </View>
    </View>
  );
}
