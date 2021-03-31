import { Dimensions, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');

const Colors = {
  mBackColor: '#efefef',
  mBorderColor: '#efefef',
  white: '#FFFFFF',
  shadowColor: '#A69E9E',
};

const Metrics = {
  containerWidth: width - 30,
  switchWidth: width / 2.7,
  height: 50,
};

const styles = StyleSheet.create({
  container: {
    width: Metrics.containerWidth,
    height: Metrics.height,
    flexDirection: 'row',
    backgroundColor: Colors.mBackColor,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: Colors.mBorderColor,
    borderRadius: Metrics.height / 2,
  },

  switcher: {
    flexDirection: 'row',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: Colors.white,
    borderRadius: Metrics.height / 2,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    width: Metrics.switchWidth, // Should be automatically calculated (width/No of items)
    shadowOpacity: 0.31,
    shadowRadius: 10,
    shadowColor: Colors.shadowColor,
  },
  buttonStyle: {
    flex: 1,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
