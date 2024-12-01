import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { loadHistory } from '../utils/storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import 'react-native-gesture-handler';
//import { BannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

interface MatchHistoryItem {
  id: string;
  scoreA: number; 
  scoreB: number; 
  playerA: string;
  playerB: string;
  duration: number;
  whenPlayed: string;
}

// const adUnitId = __DEV__
//  ? TestIds.BANNER
//  : Platform.OS === 'android'
//  ? 'ca-app-pub-3691331846902867/2255448111'
//  : 'ca-app-pub-3691331846902867/4686170335';
// const adUnitId2 = __DEV__
//  ? TestIds.BANNER 
//  : Platform.OS === 'android'
//  ? 'ca-app-pub-3691331846902867/1240252484'
//  : 'ca-app-pub-3691331846902867/9486408160'

// Utility function for time ago
const timeAgo = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  

  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hrs ago`;
  return `${Math.floor(diffInSeconds / 86400)} days ago`;
};

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [teamA, setTeamA] = useState('');
  const [teamB, setTeamB] = useState('');
  const [matchHistory, setMatchHistory] = useState<MatchHistoryItem[]>([]);


  useEffect(() => {
      // Lock orientation to landscape
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
  
      return () => {
        // Unlock orientation when leaving the screen
        ScreenOrientation.unlockAsync();
      };
    }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      const history = await loadHistory();
      setMatchHistory(history);
    };
    fetchHistory();
  }, []);

  const handleStartGame = () => {
    if (teamA.trim() && teamB.trim()) {
      navigation.navigate('Scoreboard', {
        teamA: teamA.trim(),
        teamB: teamB.trim(),
      });
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scoreList}>
        {/* Placeholder for the top header */}
        <View style={styles.header}>
          {/* Ad in Placeholder 1 */}
          <View style={styles.placeholder1}>
            {/* <BannerAd
              unitId={adUnitId}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }} 
            />*/}
          </View>

          {/* Ad in Placeholder 2 */}
          <View style={styles.placeholder2}>
            {/* <BannerAd
              unitId={adUnitId2}
              size={BannerAdSize.BANNER}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            /> */}
          </View>
        </View>

        <Text style={styles.title}>Previous Match Scores </Text>
        {matchHistory.length === 0 ? (
          <Text style={styles.emptyText}>No match history available.</Text>
        ) : (
          [...matchHistory]
            .sort((a, b) => new Date(b.whenPlayed).getTime() - new Date(a.whenPlayed).getTime()) // Sort by time (most recent first)
            .map(
              (
                item: {
                  duration: number;
                  whenPlayed: string;
                  scoreA:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<any>
                    | Iterable<React.ReactNode>
                    | null
                    | undefined;
                  scoreB:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<any>
                    | Iterable<React.ReactNode>
                    | null
                    | undefined;
                  playerA:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<any>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                  playerB:
                    | string
                    | number
                    | boolean
                    | React.ReactElement<any>
                    | Iterable<React.ReactNode>
                    | React.ReactPortal
                    | null
                    | undefined;
                },
                index: React.Key | null | undefined
              ) => (
                <View key={index} style={styles.matchCard}>
                  <LinearGradient
                    colors={
                      item.scoreA > item.scoreB
                        ? ['#DB3C44', '#261818', '#121212'] // Team A wins, red gradient on left
                        : item.scoreB > item.scoreA
                          ? ['#121212', '#161236', '#250ED4'] // Team B wins, blue gradient on right
                          : ['#DB3C44', '#1E1E1E', '#250ED4'] // Neutral gradient if it's a tie
                    }
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    locations={[0, 0.5, 1]}>
                    <View style={styles.matchHeader}>
                      <Text style={styles.matchDuration}>
                        {Math.floor(item.duration / 60)}:{('0' + (item.duration % 60)).slice(-2)}
                      </Text>
                      <View style={styles.separatorLine}></View>
                      <Text style={styles.matchTime}>{timeAgo(item.whenPlayed)}</Text>
                    </View>
                    <View style={styles.matchContent}>
                      {/* Team A */}
                      <View style={styles.teamContainer}>
                        <Text style={styles.teamNameGradientA}>{item.scoreA}</Text>
                        <View style={styles.teamNameWithIcon}>
                          {item.scoreA > item.scoreB && (
                            <Image
                              source={require('../assets/QueenIcong.png')}
                              style={[styles.queenIcon]}
                            />
                          )}
                          <Text style={styles.teamNameRed}>{item.playerA}</Text>
                        </View>
                      </View>

                      {/* Team B */}
                      <View style={styles.teamContainer}>
                        <Text style={styles.teamNameGradientB}>{item.scoreB}</Text>
                        <View style={styles.teamNameWithIcon}>
                          {item.scoreB > item.scoreA && (
                            <Image
                              source={require('../assets/QueenIcong.png')}
                              style={[styles.queenIcon]}
                            />
                          )}
                          <Text style={styles.teamNameBlue}>{item.playerB}</Text>
                        </View>
                      </View>
                    </View>
                  </LinearGradient>
                </View>
              )
            )
        )}
      </ScrollView>

      <View style={styles.newMatchSection}>
        <Text style={styles.newMatchTitle}>New Match</Text>
        <Text style={styles.newMatchSubtitle}>Enter the teams details for adding scores.</Text>
        <TextInput
          style={styles.input}
          placeholder="Name of Team A"
          value={teamA}
          onChangeText={setTeamA}
        />
        <TextInput
          style={styles.input}
          placeholder="Name of Team B"
          value={teamB}
          onChangeText={setTeamB}
        />
        <TouchableOpacity style={styles.startButton} onPress={handleStartGame}>
          <Text style={styles.startButtonText}>Start Game</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'black' },
  header: { marginTop: 40, paddingHorizontal: 1 },
  placeholder1: { height: 140, backgroundColor: '#E0E0E0', borderRadius: 8, marginVertical: 8 },
  placeholder2: { height: 68, backgroundColor: '#E0E0E0', borderRadius: 8, marginVertical: 8 },
  scoreList: { flex: 1, marginHorizontal: 16, paddingTop: 16 },
  title: {
    fontSize: 16,
    paddingBottom: 5,
    fontWeight: 'bold',
    color: '#FFF',
  },
  matchCard: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#DDD',
    marginVertical: 16,
  },
  matchInfo: { alignItems: 'center' },
  teamNameRed: {
    fontSize: 16,
    color: '#DB3C44',
    textShadowColor: 'rgba(255, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  teamNameBlue: {
    fontSize: 16,
    color: '#250ED4',
    textShadowColor: 'rgba(0, 0, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  newMatchSection: {
    height: 290,
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#FFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    elevation: 5,
    borderTopStartRadius: 20,
    borderTopEndRadius: 20,
  },
  newMatchTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 8 },
  newMatchSubtitle: { fontSize: 14, color: '#666', marginBottom: 12 },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  startButton: {
    height: 50,
    backgroundColor: 'black',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#888' },
  matchHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 12,
    gap: 20,
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  matchDuration: {
    fontSize: 14,
    color: '#AAA',
  },
  matchTime: {
    fontSize: 14,
    color: '#AAA',
  },
  matchContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
  },
  teamContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  teamNameGradientA: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF4D4D',
    textShadowColor: 'rgba(255, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  teamNameGradientB: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4D4DFF',
    textShadowColor: 'rgba(0, 0, 255, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  teamNameWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4, // Add spacing between the crown and name
  },
  queenIcon: {
    height: 12,
    width: 12,
    marginRight: 4,
  },
});