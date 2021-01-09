import React, { Component } from "react";
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
import Swipe from "./src/Swiper";
import jobs from "./src/data";

class App extends Component {
  state = {
    likedJobs: 0,
    passedJobs: 0,
    cards: jobs,
  };

  handleLikedJob = () => {
    this.setState(({ likedJobs }) => ({
      likedJobs: likedJobs + 1,
    }));
  };

  handlePassedJob = () => {
    this.setState(({ passedJobs }) => ({
      passedJobs: passedJobs + 1,
    }));
  };

  renderCards(job) {
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

  renderNoMoreCards = () => {
    return (
      <Card title="No More cards">
        <Button
          title="Do something"
          large
          icon={{ name: "my-location" }}
          backgroundColor="#03A9F4"
          onPress={this.onReset}
        />
      </Card>
    );
  };

  onReset = () => {};

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.statusStyle}>
          <Text style={{ color: "red" }}>Passed: {this.state.passedJobs}</Text>
          <Text style={{ color: "blue" }}>Like: {this.state.likedJobs}</Text>
        </View>
        <Swipe
          onSwipeRight={this.handleLikedJob}
          onSwipeLeft={this.handlePassedJob}
          onReset={this.onReset}
          keyProp="jobId"
          data={this.state.cards}
          renderCard={this.renderCards}
          renderNoMoreCards={this.renderNoMoreCards}
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
            const card = {
              jobtitle: `Test ${this.state.cards.length}`,
              company: `Test ${this.state.cards.length}`,
              snippet:
                "a <b>Java</b> Developer to join our team. This position will be responsible for design and development of <b>Java</b>... <b>Java</b> or C# Frameworks/Skills: <b>Java</b> EE, <b>Java</b> Swing or... ",
              jobId: `83400e947276d20b${this.state.cards.length}`,
              formattedRelativeTime: "1 day ago",
            };
            const newCards = [...this.state.cards, card];
            this.setState({ cards: newCards });
          }}
        />
      </SafeAreaView>
    );
  }
}

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
