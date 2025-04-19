import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../firebase-config';
import { collection, addDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const WriteScreen = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }

    const newPost = {
      title,
      content,
      recommendations: 0,
      recommendedBy: [],
      comments: [],
      authorEmail: user.email,
      createdAt: new Date().getTime(),
    };

    try {
      const docRef = await addDoc(collection(db, 'posts'), newPost);
      console.log("게시글 작성 완료:", docRef.id);

      Alert.alert('작성 완료', '게시글이 성공적으로 등록되었습니다.', [
        {
          text: '확인',
          onPress: () => {
            console.log("게시글 등록 후, 게시판 화면으로 이동");
            navigation.navigate('게시판'); // 게시판 화면으로 이동
          }
        }
      ]);
    } catch (error) {
      Alert.alert('오류', '게시글을 저장하는 중 문제가 발생했습니다.');
      console.error('게시글 저장 오류:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>제목</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} placeholder="제목을 입력하세요" />

      <Text style={styles.label}>내용</Text>
      <TextInput style={[styles.input, styles.textArea]} value={content} onChangeText={setContent} placeholder="내용을 입력하세요" multiline />

      <Button title="작성 완료" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  textArea: { height: 100 },
});

export default WriteScreen;
