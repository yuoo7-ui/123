import { Text, View, Button } from 'react-native';
import React from 'react';

export default function HomeScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30, fontWeight: "bold" }}>메인 화면</Text>
      <Button title="게임 시작하기" onPress={() => navigation.navigate('Game')} />
      <Button title="날씨 보기" onPress={() => navigation.navigate('Weather')} />
    </View>
  );
}
