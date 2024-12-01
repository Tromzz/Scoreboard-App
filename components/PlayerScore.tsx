import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PlayerScores = ({ teamName, score, onScoreChange }) => {
  return (
    <View style={styles.scoreContainer}>
      <Text style={styles.score}>{score}</Text>
      <Text style={styles.teamName}>{teamName}</Text>
      <Button title="Score" onPress={onScoreChange} />
    </View>
  );
};

const styles = StyleSheet.create({
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  score: {
    fontSize: 48,
    marginHorizontal: 20,
  },
  teamName: {
    fontSize: 24,
  },
});

export default PlayerScores;
