import { Platform, StyleSheet } from 'react-native';
import FridgesView, { Fridge } from '../../components/FridgesView';
import { SafeAreaView } from 'react-native-safe-area-context';
import {useState} from "react";


export default function TabTwoScreen() {

    const [fridges, setFridges] = useState<Fridge[]>();

    const handleCreateFridge = (name: string) => {
        const newFridge: Fridge = {
            id: ((fridges?.length ?? 0) +1).toString(), // Simple ID generation
            name,
            ingredients: [],
        };
        setFridges(current => [newFridge, ...current || []]);
    }

  return (
      <SafeAreaView style={styles.safeArea} edges={['top']}>
        <FridgesView
            fridges={fridges}
            onCreate={handleCreateFridge}
        />
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
