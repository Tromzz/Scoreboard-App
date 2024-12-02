import React, { useState, useEffect, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { ScoreContext } from '../context/ScoreContext';
import { saveHistory } from '../utils/storage';
import * as ScreenOrientation from 'expo-screen-orientation';
import { InterstitialAd, AdEventType, TestIds } from 'react-native-google-mobile-ads';


export default function ScoreboardScreen({ navigation, route }) {
  const { teamA, teamB } = route.params;
  const [scoreA, setScoreA] = useState(0);
  const [scoreB, setScoreB] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [time, setTime] = useState(0);
  const [isEditing, setIsEditing] = useState(false); // New state for edit mode
  const [matchHistory, setMatchHistory] = useContext(ScoreContext);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [tempScoreA, setTempScoreA] = useState(scoreA); // Temporary score for editing Team A
  const [tempScoreB, setTempScoreB] = useState(scoreB); // Temporary score for editing Team B
  const interstitialAd = InterstitialAd.createForAdRequest(
    __DEV__
    ? TestIds.INTERSTITIAL
    : Platform.OS === 'android'
    ? 'ca-app-pub-3691331846902867/5125154034 '
    : 'ca-app-pub-3691331846902867/2906184801',
    {
      requestNonPersonalizedAdsOnly: true,
    }
  );


  useEffect(() => {
    // Lock orientation to landscape
    ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);

    return () => {
      // Unlock orientation when leaving the screen
      ScreenOrientation.unlockAsync();
    };
  }, []);

  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current); // Ensure it's not null
    }
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  const formatTime = (timer: number) => {
    const minutes = String(Math.floor(timer / 60)).padStart(2, '0');
    const seconds = String(timer % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const handleEndGame = () => {
    const newMatch = {
      playerA: teamA,
      playerB: teamB,
      scoreA,
      scoreB,
      duration: time,
      whenPlayed: new Date().toISOString(),
    };

    Alert.alert('Save Match', 'Do you want to save this match and exit?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Save',
        onPress: () => {
          setMatchHistory((prevHistory: any) => {
            const updatedHistory = [...prevHistory, newMatch];
            saveHistory(updatedHistory);
            return updatedHistory;
          });
          //navigation.navigate('Home');
          // Load and show interstitial ad
          interstitialAd.load();
          interstitialAd.addAdEventListener(AdEventType.LOADED, () => {
            interstitialAd.show();
          });

          interstitialAd.addAdEventListener(AdEventType.CLOSED, () => {
            navigation.navigate('Home'); // Navigate to Home screen after the ad
          });

          interstitialAd.addAdEventListener(AdEventType.ERROR, () => {
            console.warn('Ad failed to load. Proceeding to Home screen.');
            navigation.navigate('Home'); // If the ad fails, proceed to Home
          });
        },
      },
    ]);
  };

  if (isEditing) {
    // Edit mode UI
    return (
      <LinearGradient colors={['#000000', '#000000']} style={styles.editContainer}>
        {/* Team A Editing */}
        <View style={[styles.teamEditSectionA, { backgroundColor: '#000000' }]}>
          <View style={[styles.teamEditSectionsub, { backgroundColor: '#FF4D4D' }]}>
            <View style={styles.teamEditSectiondata}>
              <Text style={styles.teamNameEdit}>Team A</Text>
              <Text style={styles.teamSubtextEdit}>{teamA}</Text>
              <Text style={styles.teamEditSectionscore}>
                {String(tempScoreA).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.scoreControls}>
              <TouchableOpacity onPress={() => setTempScoreA((prev) => prev + 1)}>
                <Image source={require('../assets/plus.png')} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTempScoreA((prev) => Math.max(0, prev - 1))}>
                <Image source={require('../assets/minus.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.hr2main}>
          <View style={styles.hr2} />
        </View>
        {/* Team B Editing */}

        <View style={[styles.teamEditSectionB, { backgroundColor: '#000000' }]}>
          <View style={[styles.teamEditSectionsub, { backgroundColor: '#4D4DFF' }]}>
            <View style={styles.teamEditSectiondata}>
              <Text style={styles.teamNameEdit}>Team B</Text>
              <Text style={styles.teamSubtextEdit}>{teamB}</Text>
              <Text style={styles.teamEditSectionscore}>
                {String(tempScoreB).padStart(2, '0')}
              </Text>
            </View>
            <View style={styles.scoreControls}>
              <TouchableOpacity
                // style={styles.editButton}
                onPress={() => setTempScoreB((prev) => prev + 1)}>
                <Image source={require('../assets/plusb.png')} />
              </TouchableOpacity>
              <TouchableOpacity
                // style={styles.editButton}
                onPress={() => setTempScoreB((prev) => Math.max(0, prev - 1))}>
                <Image source={require('../assets/minusb.png')} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Confirm and Cancel Buttons */}
        <View style={styles.editFooterDev}>
          <View style={styles.editFooter}>
            {/* Cancel Button */}
            <TouchableOpacity
              style={[styles.controlButton, { backgroundColor: '#FF4D4D' }]}
              onPress={() => {
                setTempScoreA(scoreA); // Revert changes
                setTempScoreB(scoreB);
                setIsEditing(false); // Exit edit mode
              }}>
              <Image style={styles.image} source={require('../assets/cancel.png')} />
            </TouchableOpacity>
            {/* Confirm Button */}
            <TouchableOpacity
              style={styles.controlButton2}
              onPress={() => {
                setScoreA(tempScoreA); // Save changes
                setScoreB(tempScoreB);
                setIsEditing(false); // Exit edit mode
              }}>
              <Image source={require('../assets/tick.png')} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.editmode}>
          <Image style={styles.editmodeImage} source={require('../assets/editmode.png')} resizeMode='contain' />
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#FF4D4D', '#4D4DFF']} style={styles.container}>
      <View style={styles.scoreboard}>
        <Image style={styles.scoreboardImage} source={require('../assets/scoreboard.png')} resizeMode='contain' />
      </View>
      {/* Team A */}
      <TouchableOpacity
        style={[styles.teamSection, { backgroundColor: '#FF4D4D' }]}
        onPress={() => setScoreA(scoreA + 1)}>
        <View>
          <Text style={styles.score}>
            {String(scoreA).padStart(2, '0')} 
          </Text>
          {/* Ensure two-digit format */}
          <View style={styles.teamNameContainer}>
            <Text style={styles.teamName}>Team A</Text>
            <Text style={styles.teamSubtext}>{teamA}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.hr2} />

      {/* Team B */}
      <TouchableOpacity
        style={[styles.teamSection, { backgroundColor: '#4D4DFF' }]}
        onPress={() => setScoreB(scoreB + 1)}>
        <Text style={styles.score}>
          {String(scoreB).padStart(2, '0')}
        </Text>
        {/* Ensure two-digit format */}
        <View style={styles.teamNameContainer}>
          <Text style={styles.teamName1}>Team B</Text>
          <Text style={styles.teamSubtext1}>{teamB}</Text>
        </View>
      </TouchableOpacity>

      {/* Controls */}
      <View style={styles.controls}>
        {/* Edit Button */}
        <TouchableOpacity
          style={styles.controlButton3}
          onPress={() => {
            setTempScoreA(scoreA); // Synchronize temporary scores with current scores
            setTempScoreB(scoreB);
            setIsEditing(true); // Enter edit mode
          }}>
          <Image source={require('../assets/edit.png')} />
        </TouchableOpacity>
        <View style={styles.controlButtondev}>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={() => setIsPaused((prev) => !prev)}>
            <Image
              source={isPaused ? require('../assets/play.png') : require('../assets/pause.png')}
            />
          </TouchableOpacity>
          <View style={styles.hr} />
          <Image source={require('../assets/timer.png')} />
          <Text style={styles.timer}>{formatTime(time)}</Text>
        </View>

        <TouchableOpacity style={styles.controlButton4} onPress={handleEndGame}>
          <Image source={require('../assets/tick.png')} />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  scoreboard: {
    position: 'absolute',
    zIndex: 1,
    left: '28%',
  },
  scoreboardImage: {
    width: 400,
    height: 50,
  },
  teamSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 200,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  teamEditSectionscore: {
    fontSize: 160,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
  },
  teamNameContainer: {
    flexDirection: 'column',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  teamName: {
    fontSize: 20,
    marginLeft: 10,
    textAlign: 'left',
    color: '#FFF',
  },
  teamName1: {
    fontSize: 20,
    textAlign: 'right',
    color: '#FFF',
    marginLeft: 90,
  },
  teamSubtext: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'left',
    marginLeft: 10,
    color: '#FFF',
  },
  teamSubtext1: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'right',
    marginLeft: 90,
    color: '#FFF',
  },
  controls: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtondev: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    borderRadius: 100,
    padding: 8,
    gap: 5,
  },
  controlButton: {
    width: 30,
    height: 30,
    borderRadius: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 55,
    height: 55,
  },
  controlButton2: {
    width: 50,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  controlButton4: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  controlButton3: {
    width: 44,
    height: 44,
    borderRadius: 100,
    backgroundColor: '#d71507',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 30,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'transparent',
    padding: 8,
    borderRadius: 100,
  },
  hr: {
    height: 15,
    width: 1,
    backgroundColor: '#FFF',
    marginHorizontal: 10,
  },
  hr2main: {
    display: 'flex',
    justifyContent: 'center',
  },

  hr2: {
    height: 150,
    width: 1,
    backgroundColor: 'grey',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 10,
  },
  editContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  teamEditSectionA: {
    flex: 1,
    alignItems: 'center',
  },
  teamEditSectionsub: {
    width: 300,
    height: 330,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    position: 'relative',
  },
  teamEditSectiondata: {
    width: 300,
    height: 330,
    display: 'flex',
    justifyContent: 'center',
  },

  teamEditSectionB: {
    flex: 1,
    alignItems: 'center',
  },
  teamNameEdit: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  teamSubtextEdit: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  editFooterDev: {
    position: 'absolute',
    bottom: 9,
    left: '45%',
  },
  editFooter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  editmode: {
    position: 'absolute',
    left: '28%',
  },
  editmodeImage: {
    width: 400,
    height: 50,
  },
  scoreControls: {
    display: 'flex',
    flexDirection: 'row',
    gap: 10,
    position: 'absolute',
    bottom: -22,
    left: 40,
  },
  editButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});