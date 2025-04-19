import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";

// 아이콘
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

// 화면 import
import TodoListScreen from './screens/TodoListScreen';
import TodoWriteScreen from './screens/TodoWriteScreen';
import MyPageScreen from './screens/MyPageScreen';
import HomeScreen from './screens/HomeScreen';
import ButlerScreen from './screens/ButlerScreen';
import GameScreen from './screens/GameScreen';
import LoginScreen from './components/LoginScreen';
import SignUpScreen from './components/SignUpScreen';
import BoardScreen from './writescreens/BoardScreen';
import WriteScreen from './writescreens/WriteScreen';
import PostDetailScreen from './writescreens/PostDetailScreen';
import map from './screens/map';
import WeatherScreen from './screens/WeatherScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ✅ Auth Stack (회원가입 / 로그인)
const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="SignUp" component={SignUpScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

// ✅ 활동일지 스택
const TodoStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="활동일지" component={TodoListScreen} options={{ headerShown: false }} />
    <Stack.Screen name="활동일지쓰기" component={TodoWriteScreen} options={{ headerShown: false }} />
    <Stack.Screen name="집사정보" component={ButlerScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

// ✅ 마이페이지 스택
const MyPageStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="마이페이지" component={MyPageScreen} options={{ headerShown: false }} />
    <Stack.Screen name="집사정보" component={ButlerScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// ✅ 홈 스택
const HomeStackScreen = () => (
  <Stack.Navigator>
    <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Game" component={GameScreen} options={{ title: "게임 화면" }} />
    <Stack.Screen name="Weather" component={WeatherScreen} options={{ title: "날씨 화면" }} />
  </Stack.Navigator>
);

// ✅ 게시판 스택
const BoardStackScreen = ({ posts, setPosts }) => (
  <Stack.Navigator>
    <Stack.Screen name="게시판">
      {props => <BoardScreen {...props} posts={posts} setPosts={setPosts} />}
    </Stack.Screen>
    <Stack.Screen name="게시글 작성">
      {props => <WriteScreen {...props} posts={posts} setPosts={setPosts} />}
    </Stack.Screen>
    <Stack.Screen name="게시글 상세">
      {props => <PostDetailScreen {...props} posts={posts} setPosts={setPosts} />}
    </Stack.Screen>
    <Stack.Screen name="게시글 수정">
      {props => <PostDetailScreen {...props} posts={posts} setPosts={setPosts} />}
    </Stack.Screen>
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

// ✅ Main App (탭 네비게이션)
const MainApp = () => {
  const [posts, setPosts] = useState([]);

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="활동일지"
        component={TodoStackScreen}
        options={{
          title: '활동일지',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => <Entypo name="open-book" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="게시판"
        children={() => <BoardStackScreen posts={posts} setPosts={setPosts} />}
        options={{
          title: '게시판',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="clipboard-list" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="HomeStack"
        component={HomeStackScreen}
        options={{
          title: '메인 홈',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => <AntDesign name="home" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="map"
        component={map}
        options={{
          title: '동물병원지도',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => <AntDesign name="map" size={24} color="black" />,
        }}
      />
      <Tab.Screen
        name="내정보"
        component={MyPageStackScreen}
        options={{
          title: '마이 페이지',
          headerTitleAlign: 'center',
          tabBarIcon: ({ focused }) => <FontAwesome6 name="circle-user" size={24} color="black" />,
        }}
      />
    </Tab.Navigator>
  );
};

// ✅ App 컴포넌트
const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) return null; // 또는 로딩 UI 표시

  return (
    <NavigationContainer>
      {user ? <MainApp /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default App;
