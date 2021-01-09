import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  View,
  Animated,
  PanResponder,
  Dimensions,
  LayoutAnimation,
  UIManager,
  Platform,
} from "react-native";
import { Button, Card } from "react-native-elements";

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

interface SwipeProps {
  onSwipeRight: () => {};
  onSwipeLeft: () => {};
  renderNoMoreCards: () => {};
  renderCard: (item: any) => {};
  onReset: () => {};
  onTap: (item: any) => {};
  keyProp: "id";
  data: any;
  stackSize: number;
  loop?: boolean;
  isRemoveSwipeLeft?: boolean;
  isRemoveSwipeRight?: boolean;
}

export interface SwipeRef {
  addCards?(items: any): void;
}

const Swipe = forwardRef((props: SwipeProps, ref: any) => {
  useImperativeHandle(ref, () => ({
    addCards: (items: any) => {
      setCards([...cards, ...items]);
    },
  }));

  const {
    onSwipeRight,
    onSwipeLeft,
    //   renderNoMoreCards,
    renderCard,
    onReset,
    onTap,
    keyProp,
    data,
    stackSize = 3,
    loop = false,
    isRemoveSwipeLeft = false,
    isRemoveSwipeRight = false,
  } = props;
  const position = new Animated.ValueXY();
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponderCapture: () => false,
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (event, gesture) => {
      position.setValue({ x: gesture.dx, y: gesture.dy });
    },
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > SWIPE_THRESHOLD) {
        forceSwipe("right");
      } else if (gesture.dx < -SWIPE_THRESHOLD) {
        forceSwipe("left");
      } else if (gesture.dy < -SWIPE_THRESHOLD) {
        forceSwipe("top");
      } else if (gesture.dx === 0 && gesture.dy === 0) {
        onTap && onTap(cards[index]);
        resetPosition();
      } else {
        resetPosition();
      }
    },
  });

  const [index, setIndex] = useState(0);
  const [cards, setCards] = useState(data);

  useEffect(() => {
    console.log("data", data);
    setCards(data);
  }, [data]);

  console.log("RENDER", cards);

  useEffect(() => {
    setIndex(0);
  }, [onReset]);

  function forceSwipe(direction: string) {
    let toValue = { x: 0, y: 0 };
    switch (direction) {
      case "right":
        toValue = { x: SCREEN_WIDTH, y: 0 };
        break;
      case "left":
        toValue = { x: -SCREEN_WIDTH, y: 0 };
        break;
      case "top":
        toValue = { x: 0, y: -SCREEN_WIDTH };
        break;
      default:
        break;
    }
    Animated.timing(position, {
      toValue: toValue,
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(direction));
  }

  function onSwipeComplete(direction: string) {
    const item = data[index];

    direction === "right" ? onSwipeRight(item) : onSwipeLeft(item);
    position.setValue({ x: 0, y: 0 });

    UIManager.setLayoutAnimationEnabledExperimental &&
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.spring();
    if (loop) {
      const newCards = [...cards];
      console.log("loop before", newCards);

      const isRemoveCardIndex =
        (direction === "left" && isRemoveSwipeLeft) ||
        (direction === "right" && isRemoveSwipeRight);
      if (!isRemoveCardIndex) {
        newCards.push(newCards[0]);
        newCards.shift();
      } else if (isRemoveCardIndex) {
        newCards.shift();
      }
      console.log("loop", newCards);

      setCards(newCards);
      setIndex(0);
    } else {
      setIndex(index + 1);
    }
  }

  function resetPosition() {
    Animated.spring(position, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  }

  const renderNoMoreCards = () => {
    return (
      <Card title="No More cards">
        <Button
          title="Do something"
          large
          icon={{ name: "my-location" }}
          backgroundColor="#03A9F4"
          onPress={() => {
            setCards(data);

            setIndex(0);
          }}
        />
      </Card>
    );
  };

  function getCardStyle() {
    const rotate = position.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ["-120deg", "0deg", "120deg"],
    });

    return {
      ...position.getLayout(),
      transform: [{ rotate }],
    };
  }

  function renderCards() {
    if (index >= cards.length) {
      return renderNoMoreCards();
    }

    const deck = cards?.map((item, i) => {
      if (i < index) {
        return null;
      }

      if (i === (!loop ? index : 0)) {
        console.log("renderCards", i, index);

        return (
          <Animated.View
            key={`${item[keyProp]}${cards.length === 1 ? Math.random() : ""}`}
            style={[getCardStyle(), styles.cardStyle, { zIndex: 99 }]}
            {...panResponder.panHandlers}
          >
            {renderCard(item)}
          </Animated.View>
        );
      } else if (i - (!loop ? index : 0) < stackSize) {
        return (
          <Animated.View
            key={item[keyProp]}
            style={[
              styles.cardStyle,
              styles.cardStyleSecond,
              { top: 20 * (i - index), zIndex: 5 },
            ]}
          >
            {renderCard(item)}
          </Animated.View>
        );
      }
    });

    return Platform.OS === "android" ? deck : deck.reverse();
  }

  return (
    <View>
      {renderCards()}
      <View
        style={{
          marginTop: 100,
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: "row",
        }}
      >
        <Button
          title="Left"
          large
          backgroundColor="#03A9F4"
          onPress={() => {
            forceSwipe("left");
          }}
        />
        <Button
          title="Maybe"
          large
          backgroundColor="#03A9F4"
          onPress={() => {
            forceSwipe("top");
          }}
        />
        <Button
          title="Right"
          large
          backgroundColor="#03A9F4"
          onPress={() => {
            forceSwipe("right");
          }}
        />
      </View>
    </View>
  );
});

const styles = {
  cardStyle: {
    width: SCREEN_WIDTH,
  },
  cardStyleSecond: {
    position: "absolute",
  },
};

export default Swipe;
