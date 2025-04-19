import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { auth, db } from '../firebase-config';
import { doc, updateDoc, arrayUnion, arrayRemove, deleteDoc, onSnapshot } from 'firebase/firestore';

const PostDetailScreen = ({ route, navigation }) => {
  const { post } = route.params;
  const [currentPost, setCurrentPost] = useState(post);
  const [commentText, setCommentText] = useState('');
  const [hasUserRecommended, setHasUserRecommended] = useState(false);
  const user = auth.currentUser;

  // ✅ Firestore 실시간 데이터 반영
  useEffect(() => {
    const postRef = doc(db, 'posts', post.id);
    const unsubscribe = onSnapshot(postRef, (snapshot) => {
      if (snapshot.exists()) {
        const postData = snapshot.data();
        setCurrentPost({ id: snapshot.id, ...postData });

        // 추천 여부 확인
        const recommendations = postData.recommendations || [];
        const userHasRecommended = recommendations.includes(user?.email);
        setHasUserRecommended(userHasRecommended);
      } else {
        navigation.goBack();
      }
    });

    return () => unsubscribe();
  }, []);

  // ✅ 게시글 삭제 기능
  const handleDeletePost = async () => {
    if (!user || user.email !== currentPost.authorEmail) return;

    Alert.alert('게시글 삭제', '정말 삭제하시겠습니까?', [
      { text: '취소', style: 'cancel' },
      {
        text: '삭제',
        onPress: async () => {
          await deleteDoc(doc(db, 'posts', currentPost.id));
          navigation.replace('게시판'); // 🔥 삭제 후 게시판으로 이동
        },
      },
    ]);
  };

  // ✅ 댓글 추가 기능
  const handleAddComment = async () => {
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }

    if (!commentText.trim()) {
      Alert.alert('입력 오류', '댓글을 입력하세요.');
      return;
    }

    const postRef = doc(db, 'posts', currentPost.id);
    const newComment = {
      id: new Date().getTime().toString(), // ✅ `Date.now()` 중복 방지
      text: commentText,
      authorEmail: user.email,
    };

    try {
      await updateDoc(postRef, {
        comments: arrayUnion(newComment),
      });

      setCommentText(''); // ✅ 입력 필드 초기화
    } catch (error) {
      Alert.alert('오류', '댓글을 저장하는 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  // ✅ 댓글 삭제 기능
  const handleDeleteComment = async (commentId) => {
    if (!user) return;

    const postRef = doc(db, 'posts', currentPost.id);
    const commentToRemove = currentPost.comments.find((comment) => comment.id === commentId);

    if (!commentToRemove || user.email !== commentToRemove.authorEmail) return;

    try {
      await updateDoc(postRef, {
        comments: arrayRemove(commentToRemove),
      });
    } catch (error) {
      Alert.alert('오류', '댓글을 삭제하는 중 문제가 발생했습니다.');
      console.error(error);
    }
  };

  // ✅ 추천 버튼 클릭 처리
  const handleRecommend = async () => {
    if (!user) {
      Alert.alert('로그인 필요', '로그인이 되어 있지 않습니다.');
      return;
    }

    const postRef = doc(db, 'posts', currentPost.id);
    const recommendations = currentPost.recommendations || [];

    if (!hasUserRecommended) {
      // 추천 추가
      try {
        await updateDoc(postRef, {
          recommendations: arrayUnion(user.email),
        });
        setHasUserRecommended(true);
      } catch (error) {
        Alert.alert('오류', '추천을 추가하는 중 문제가 발생했습니다.');
        console.error(error);
      }
    } else {
      // 추천 취소
      try {
        await updateDoc(postRef, {
          recommendations: arrayRemove(user.email),
        });
        setHasUserRecommended(false);
      } catch (error) {
        Alert.alert('오류', '추천을 취소하는 중 문제가 발생했습니다.');
        console.error(error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {currentPost.title} <Text style={styles.author}>({currentPost.authorEmail})</Text>
      </Text>
      <Text style={styles.content}>{currentPost.content}</Text>

      {/* 게시글 삭제 버튼 */}
      {user?.email === currentPost.authorEmail && (
        <TouchableOpacity onPress={handleDeletePost} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>게시글 삭제</Text>
        </TouchableOpacity>
      )}

      {/* 추천 버튼 */}
      <TouchableOpacity onPress={handleRecommend} style={styles.recommendButton}>
        <Text style={styles.recommendButtonText}>
          {hasUserRecommended ? '추천 취소' : '추천'}
        </Text>
      </TouchableOpacity>

      {/* 추천 수 표시 */}
      <Text style={styles.recommendations}>추천 수: {currentPost.recommendations?.length || 0}</Text>

      <Text style={styles.label}>댓글</Text>
      <FlatList
        data={currentPost.comments}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.comment}>
            <Text style={styles.commentAuthor}>{item.authorEmail}:</Text>
            <Text>{item.text}</Text>
            {user?.email === item.authorEmail && (
              <TouchableOpacity onPress={() => handleDeleteComment(item.id)} style={styles.commentDeleteButton}>
                <Text style={styles.commentDeleteButtonText}>삭제</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />

      {/* 댓글 입력 */}
      <TextInput style={styles.input} value={commentText} onChangeText={setCommentText} placeholder="댓글을 입력하세요" />
      <Button title="댓글 추가" onPress={handleAddComment} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  author: { fontSize: 16, color: '#666' },
  content: { fontSize: 16, marginBottom: 16 },
  label: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 16 },
  comment: { padding: 8, backgroundColor: '#fff', borderRadius: 8, marginBottom: 8, borderWidth: 1, borderColor: '#ddd' },
  commentAuthor: { fontWeight: 'bold', marginBottom: 4 },
  deleteButton: { backgroundColor: 'red', padding: 8, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  deleteButtonText: { color: '#fff', fontWeight: 'bold' },
  commentDeleteButton: { position: 'absolute', right: 10 },
  commentDeleteButtonText: { color: 'red' },
  recommendButton: { backgroundColor: '#1a73e8', padding: 8, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  recommendButtonText: { color: '#fff', fontWeight: 'bold' },
  recommendations: { fontSize: 16, color: '#555' },
});

export default PostDetailScreen;
