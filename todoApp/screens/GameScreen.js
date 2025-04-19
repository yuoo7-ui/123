import React, { useState, useEffect } from "react";
import { View, Text, Pressable, Button, Dimensions, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width, height } = Dimensions.get("window");

const BugSmasher = ({ navigation }) => {
  const [score, setScore] = useState(0);
  const [bugs, setBugs] = useState([]);
  const [timeLeft, setTimeLeft] = useState(30);
  const [gameOver, setGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    if (isGameStarted && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setGameOver(true);
      updateRankings(score);
    }
  }, [isGameStarted, timeLeft]);

  useEffect(() => {
    if (isGameStarted && timeLeft > 0) {
      const interval = setInterval(() => {
        createBug();
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isGameStarted, timeLeft]);

  useEffect(() => {
    loadRankings();
  }, []);

  const createBug = () => {
    const isYellowBug = Math.random() < 0.2;

    const newBug = {
      id: Math.random().toString(),
      x: Math.random() * (width - 50),
      y: Math.random() * (height - 450) + 120,
      type: isYellowBug ? "yellow" : "normal",
    };

    setBugs((prevBugs) => [...prevBugs, newBug]);

    setTimeout(() => {
      setBugs((prevBugs) => prevBugs.filter((bug) => bug.id !== newBug.id));
    }, 3000);
  };

  const smashBug = (id, type) => {
    setBugs((prevBugs) => prevBugs.filter((bug) => bug.id !== id));
    setScore((prevScore) => prevScore + (type === "yellow" ? 2 : 1));
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setBugs([]);
    setGameOver(false);
    setIsGameStarted(true);
  };

  const restartGame = () => {
    setIsGameStarted(false);
  };

  const loadRankings = async () => {
    try {
      const storedRankings = await AsyncStorage.getItem("rankings");
      if (storedRankings) {
        setRankings(JSON.parse(storedRankings));
      }
    } catch (error) {
      console.error("Failed to load rankings", error);
    }
  };

  const updateRankings = async (newScore) => {
    try {
      const storedRankings = await AsyncStorage.getItem("rankings");
      const currentRankings = storedRankings ? JSON.parse(storedRankings) : [];

      if (currentRankings.length >= 3 && newScore <= currentRankings[currentRankings.length - 1]) {
        return;
      }

      const updatedRankings = [...currentRankings, newScore]
        .sort((a, b) => b - a)
        .slice(0, 3);

      setRankings(updatedRankings);
      await AsyncStorage.setItem("rankings", JSON.stringify(updatedRankings));
    } catch (error) {
      console.error("Failed to update rankings", error);
    }
  };

  return (
    <View style={styles.container}>
      {!isGameStarted ? (
        <View style={styles.startContainer}>
          <Text style={styles.title}>🐞 Bug Smasher 🐞</Text>
          <Button title="게임 시작" onPress={startGame} />
        </View>
      ) : gameOver ? (
        <View style={styles.gameOverContainer}>
          <Text style={styles.gameOverText}>Game Over</Text>
          <Text style={styles.finalScore}>최종 점수: {score}</Text>
          <Text style={styles.rankingsTitle}>🏆 랭킹 🏆</Text>
          {rankings.map((rank, index) => (
            <Text key={index} style={styles.rankText}>{`${index + 1}위: ${rank}점`}</Text>
          ))}
          <Button title="다시 시작" onPress={restartGame} />
        </View>
      ) : (
        <>
          <Text style={styles.score}>점수: {score}</Text>
          <Text style={styles.timer}>남은 시간: {timeLeft}s</Text>
          {bugs.map((bug) => (
            <Pressable
              key={bug.id}
              onPress={() => smashBug(bug.id, bug.type)}
              style={[
                styles.bug,
                { top: bug.y, left: bug.x },
                bug.type === "yellow" ? styles.yellowBug : styles.normalBug,
              ]}
            >
              <Text style={styles.bugText}>{bug.type === "yellow" ? "🐝" : "🐞"}</Text>
            </Pressable>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  startContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  score: {
    fontSize: 24,
    fontWeight: "bold",
    position: "absolute",
    top: 50,
  },
  timer: {
    fontSize: 18,
    position: "absolute",
    top: 80,
  },
  bug: {
    position: "absolute",
  },
  yellowBug: {
    backgroundColor: "yellow",
    borderRadius: 20,
    padding: 5,
  },
  bugText: {
    fontSize: 30,
  },
  gameOverContainer: {
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
  },
  finalScore: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  rankingsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  rankText: {
    fontSize: 18,
    marginTop: 5,
  },
});

export default BugSmasher;
