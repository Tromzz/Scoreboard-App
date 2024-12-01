import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

const ScoreHistory = ({ history }) => {
  function timeAgo(whenPlayed: any): React.ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <FlatList
      data={history}
      keyExtractor={(item, index) => index.toString()} // Use index as key
      renderItem={({ item }) => (
        <View style={styles.historyItem}>
          <Text style={styles.historyText}>
            {item.playerA} {item.scoreA > item.scoreB && '👑'} vs {item.playerB}{' '}
            {item.scoreB > item.scoreA && '👑'}
          </Text>
          <Text style={styles.historyText}>
            Score: {item.scoreA} - {item.scoreB}
          </Text>
          <Text style={styles.historyText}>Duration: {item.duration} sec</Text>
          <Text style={styles.historyText}>{timeAgo(item.whenPlayed)}</Text>
        </View>
      )}
      ListEmptyComponent={<Text style={styles.emptyText}>No match history available.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  historyText: {
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
});

export default ScoreHistory;
