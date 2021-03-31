import React from 'react';
import { View } from 'react-native';
import Slider from './src/components/Slider';
const styles = {
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
};
const App = () => {
  const disableScroll = value => {
    console.log('scrollEnabled', value);
  };
  const onStatusChanged = text => {
    console.log('Change Status ', text);
  };
  return (
    <View style={styles.container}>
      <Slider
        currentStatus={'Open'}
        disableScroll={disableScroll}
        isParentScrollEnabled={false}
        onStatusChanged={onStatusChanged}
        items={['Fresh Juice', 'Milk Shake', 'Water']}
      />
    </View>
  );
};
export default App;
