import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { WEATHER_API_KEY } from "@env";
import * as Location from 'expo-location';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const weatherApiKey = WEATHER_API_KEY;

// 현재 날짜 및 시간 포맷팅 훅
const useRegDate = () => {
  const [currentDate, setCurrentDate] = useState(null);

  useEffect(() => {
    const date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let date2 = date.getDate();
    let day = date.getDay(); // 0(일) ~ 6(토)
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "pm" : "am";

    hours = hours % 12 || 12; // 0시는 12시로 표시
    const hoursString = hours < 10 ? `0${hours}` : hours;
    const minutesString = minutes < 10 ? `0${minutes}` : minutes;

    const dayOfTheWeek = ['일', '월', '화', '수', '목', '금', '토'];
    const formattedDate = `${year}년 ${month}월 ${date2}일 (${dayOfTheWeek[day]}) ${hoursString}:${minutesString} ${ampm}`;

    setCurrentDate(formattedDate);
  }, []);

  return currentDate;
};

export default function App() {
  // 상태 변수
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [permitted, setPermitted] = useState(true);
  const [city, setCity] = useState(null);
  const [dailyWeather, setDailyWeather] = useState([]); // 빈 배열로 초기화
  const currentDate = useRegDate();

  // 위치 및 날씨 데이터 가져오기
  const locationData = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setPermitted(false);
      setErrorMsg('위치에 대한 권한 부여가 거부되었습니다.');
      return;
    }

    const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync({ accuracy: 5 });
    
    const address = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false });
    const cityAdress = address[0]?.city || "알 수 없음";
    setCity(cityAdress);

    const weatherApiUrl = `https://api.openweathermap.org/data/3.0/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&units=metric&lang=kr&appid=${weatherApiKey}`;
    const respToWeather = await fetch(weatherApiUrl); 
    const jsonForWeather = await respToWeather.json();

    if (jsonForWeather?.daily) {
      setDailyWeather(jsonForWeather.daily);
    } else {
      setDailyWeather([]); // daily 속성이 없으면 빈 배열로 설정
    }
  };

  useEffect(() => {
    locationData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.cityCon}>
        <Text style={styles.city}>{city}</Text>
      </View>
      <View style={styles.regDateCon}>
        <Text style={styles.regDate}>{currentDate}</Text>
      </View>

      <ScrollView 
        horizontal 
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
      >
        {dailyWeather.length === 0 ? (
          <View style={styles.weatherInner}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          dailyWeather.map((day, index) => (
            <View key={index} style={styles.weatherInner}>
              <View style={styles.day}>
                <Text style={styles.desc}>{day.weather[0].description}</Text>
              </View>
              <View style={styles.tempCon}>
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(0)}°
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffe01a',
  },
  cityCon: {
    flex: 0.4,
  },
  city: {
    flex: 1,
    marginTop: 70,
    fontSize: 40,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  regDateCon: {
    alignItems: 'center',
  },
  regDate: {
    padding: 10,
    backgroundColor: 'black',
    color: 'white',
    borderRadius: 20,
    fontWeight: "bold",
  },
  weather: {},
  weatherInner: {
    flex: 3,
    width: SCREEN_WIDTH,
  },
  day: {
    flex: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  desc: {
    flex: 1.5,
    marginTop: 20,
    fontWeight: "bold",
    fontSize: 30,
  },
  tempCon: {
    flex: 0.5,
    alignItems: "center",
  }, 
  temp: {
    fontSize: 120, 
  }
});
