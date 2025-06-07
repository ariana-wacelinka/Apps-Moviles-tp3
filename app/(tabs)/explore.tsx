import { Platform, StyleSheet } from 'react-native';
import FridgesView, { Fridge } from '../../components/FridgesView';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function TabTwoScreen() {
    const myFridges: Fridge[] = [];
  return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FridgesView fridges={myFridges}/>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
    safeArea: {
        flex: 1,
        backgroundColor: 'transparent',
    },
});
