import { Platform, StyleSheet } from 'react-native';
import FridgesView, { Fridge } from '../../components/FridgesView';


export default function TabTwoScreen() {
    const myFridges: Fridge[] = [];
  return (
    <FridgesView fridges={myFridges}/>
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
});
