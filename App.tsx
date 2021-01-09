import React, { Component, useState, useRef } from "react";
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { Card, Button, Icon } from "react-native-elements";
import Swipe, { SwipeRef } from "./src/Swiper";
import jobs from "./src/data";

const App = () => {
  const [likedJobs, setLikedJobs] = useState(0);
  const [passedJobs, setPassedJobs] = useState(0);
  const [cards, setCards] = useState(jobs);
  const swipeRef = useRef<SwipeRef>(null);

  const handleLikedJob = () => {
    setLikedJobs(likedJobs + 1);
  };

  const handlePassedJob = () => {
    setPassedJobs(passedJobs + 1);
  };

  function renderCards(job) {
    return (
      <Card title={job.jobtitle} titleStyle={{ fontSize: 14 }}>
        <View style={{ height: 200 }}>
          <Image
            source={{ uri: "https://picsum.photos/200" }}
            style={{ width: "100%", height: 200 }}
          />
        </View>
        <View style={styles.detailWrapper}>
          <Text>{job.company}</Text>
          <Text>{job.formattedRelativeTime}</Text>
        </View>
        <Text numberOfLines={4}>
          {job.snippet.replace(/<b>/g, "").replace(/<\/b>/g, "")}
        </Text>
      </Card>
    );
  }

  const renderNoMoreCards = () => {
    return (
      <Card title="No More cards">
        <Button
          title="Do something"
          large
          icon={{ name: "my-location" }}
          backgroundColor="#03A9F4"
          onPress={onReset}
        />
      </Card>
    );
  };

  onReset = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.statusStyle}>
        <Text style={{ color: "red" }}>Passed: {passedJobs}</Text>
        <Text style={{ color: "blue" }}>Like: {likedJobs}</Text>
      </View>
      <Swipe
        ref={swipeRef}
        onSwipeRight={handleLikedJob}
        onSwipeLeft={handlePassedJob}
        onReset={onReset}
        keyProp="jobId"
        data={cards}
        renderCard={renderCards}
        renderNoMoreCards={renderNoMoreCards}
        loop={true}
        isRemoveSwipeLeft={true}
        isRemoveSwipeRight={true}
        onTap={(value: any) => {
          console.log("onTap", value);
        }}
      />
      <Button
        title="Add more"
        large
        style={{ marginTop: 20 }}
        backgroundColor="#03A9F4"
        onPress={() => {
          const card = [
            {
              jobtitle: `Test ${cards.length} ${Math.random()}`,
              company: `Test ${cards.length} ${Math.random()}`,
              snippet:
                "a <b>Java</b> Developer to join our team. This position will be responsible for design and development of <b>Java</b>... <b>Java</b> or C# Frameworks/Skills: <b>Java</b> EE, <b>Java</b> Swing or... ",
              jobId: `83400e947276d20b${cards.length}${Math.random()}`,
              formattedRelativeTime: "1 day ago",
            },
          ];
          swipeRef?.current?.addCards(card);
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  statusStyle: {
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  detailWrapper: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
});

export default App;
