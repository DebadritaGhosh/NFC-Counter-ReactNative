import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
//-3rd Party
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';

const App = () => {
  const [hasNfc, setHasNfc] = useState(null);
  const [start, setStart] = useState(null);
  const [totalTime, setTotalTime] = useState(0);
  const [score, setScore] = useState(0);
  const checkAvailability = async () => {
    const isSupported = await NfcManager.isSupported();
    if (isSupported) {
      await NfcManager.start();
    }
    setHasNfc(isSupported);

  }

  useEffect(() => {
    checkAvailability();
  }, [])

  useEffect(() => {
    let count = 0;
    NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
      count++;
      setScore(count)
      if (count >= 5) {
        NfcManager.unregisterTagEvent().catch(() => 0);
        setTotalTime(new Date().getTime() - start.getTime());
      }
    });

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    }
  }, [start])

  const ConnectNfc = async () => {
    await NfcManager.registerTagEvent();
    setStart(new Date());
    setTotalTime(0);
  }
  return (
    <View style={styles.container}>
      {
        hasNfc === null ? <Text style={styles.text}>Nfc Not Supported!!</Text> : <Text style={styles.text}>Nfc Supported!!</Text>
      }
      {
        <Text style={styles.text} >{score}</Text>
      }
      {
        totalTime > 0 && <Text style={styles.text} >{totalTime}</Text>
      }
      <TouchableOpacity style={styles.btn} onPress={() => ConnectNfc()}>
        <Text style={[styles.text, { color: "#5A20CB", fontWeight: "bold" }]}>Connect!</Text>
      </TouchableOpacity>
    </View>
  )
}

export default App

const styles = StyleSheet.create({
  container: { flex: 1, width: "100%", backgroundColor: "#5A20CB", justifyContent: "center", alignItems: "center" },
  text: {
    color: "white",
    fontSize: 25
  },
  btn: {
    backgroundColor: "#CAD5E2",
    padding: 10,
    marginTop: 35
  }
})