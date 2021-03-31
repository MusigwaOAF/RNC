import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import styles from './styles';

const { width } = Dimensions.get('window');

const Button = ({ title, onPress, style }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.buttonStyle}>
      <Text style={style}>{title}</Text>
    </TouchableOpacity>
  );
};

Button.propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string.isRequired,
  style: PropTypes.objectOf(PropTypes.any),
};

Button.defaultProps = { style: {}, onPress: () => {} };

const MultiSwitch = ({ onStatusChanged, disableScroll, items }) => {
  const [position] = useState(new Animated.Value(0));
  const [posValue, setPosValue] = useState(0);
  const [selectedPosition, setSelectedPosition] = useState(0);
  const [duration] = useState(100);
  const [mainWidth] = useState(width - 30);
  const [switcherWidth] = useState(width / 2.7);
  const [thresholdDistance] = useState(width - 8 - width - 2.4);

  let isParentScrollDisabled = false;
  let _panResponder = {};

  const useWMount = func => useMemo(func, [func]);

  const animateStart = item => {
    Animated.timing(position, {
      toValue: Platform.select({ ios: -2, android: 0 }),
      duration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setPosValue(Platform.select({ ios: -2, android: 0 }));
      setSelectedPosition(0);
    }, 100);
    onStatusChanged(item);
  };

  const animateMiddle = item => {
    Animated.timing(position, {
      toValue: mainWidth / 2 - switcherWidth / 2,
      duration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setPosValue(mainWidth / 2 - switcherWidth / 2);
      setSelectedPosition(1);
    }, 100);
    onStatusChanged(item);
  };

  const animateEnd = item => {
    Animated.timing(position, {
      toValue: Platform.select({
        ios: mainWidth - switcherWidth,
        android: mainWidth - switcherWidth - 2,
      }),
      duration,
      useNativeDriver: true,
    }).start();
    setTimeout(() => {
      setPosValue(
        Platform.select({
          ios: mainWidth - switcherWidth,
          android: mainWidth - switcherWidth - 2,
        }),
      );
      setSelectedPosition(2);
    }, 100);
    onStatusChanged(item);
  };

  useWMount(() => {
    _panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,
      onMoveShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => true,
      onPanResponderTerminate: () => {},

      onPanResponderGrant: () => {
        // disable parent scroll if slider is inside a scrollview
        if (!isParentScrollDisabled) {
          disableScroll(false);
          isParentScrollDisabled = true;
        }
      },

      onPanResponderMove: (_evt, gestureState) => {
        let finalValue = gestureState.dx + posValue;
        if (finalValue >= 0 && finalValue <= thresholdDistance)
          position.setValue(posValue + gestureState.dx);
      },

      // onPanResponderRelease: (_evt, gestureState) => {
      //   let finalValue = gestureState.dx + posValue;
      //   isParentScrollDisabled = false;
      //   disableScroll(true);
      //   if (gestureState.dx > 0) {
      //     if (finalValue >= 0 && finalValue <= 30) animateStart();
      //     else if (finalValue >= 30 && finalValue <= 121) animateMiddle();
      //     else if (finalValue >= 121 && finalValue <= 280) {
      //       if (gestureState.dx > 0) animateEnd();
      //       else animateMiddle();
      //     }
      //   } else {
      //     if (finalValue >= 78 && finalValue <= 175) animateMiddle();
      //     else if (finalValue >= -100 && finalValue <= 78) animateStart();
      //     else animateEnd();
      //   }
      // },
    });
  });

  const selectedLabelStyle = { color: 'green', fontWeight: 'bold' };
  const onItemPress = index => {
    if (index === 0) animateStart(items[index]);
    else if (index === items.length - 1) animateEnd(items[index]);
    else animateMiddle(items[index]);
  };

  return (
    <View style={styles.container}>
      {items.map((text, index) => (
        <Button
          key={Number(index)}
          onPress={() => onItemPress(index)}
          title={text}
        />
      ))}
      <Animated.View
        {..._panResponder.panHandlers}
        style={[styles.switcher, { transform: [{ translateX: position }] }]}>
        <Button title={items[selectedPosition]} style={selectedLabelStyle} />
      </Animated.View>
    </View>
  );
};

MultiSwitch.propTypes = {
  disableScroll: PropTypes.func.isRequired,
  onStatusChanged: PropTypes.func.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default MultiSwitch;
