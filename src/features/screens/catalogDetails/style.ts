import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  row: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
  },
  container: {
    flex: 1,
    width: '99%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: 'transparent',
  },
  dataContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    backgroundColor: 'transparent',
    zIndex: 0,
  },
  text: {
    flex: 1,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 12,
    fontSize: 16,
  },
  controlContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    justifyContent: 'center',
    backgroundColor: 'transparent',
    margin: 0,
    zIndex: 1,
  },
  option: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    color: '#4F8EF7',
  },
});
