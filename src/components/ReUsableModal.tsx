import { Modal, TouchableWithoutFeedback, View } from "react-native";
import AddFood from "./AddFood";
import { StyleSheet } from "react-native";
import AddActivity from "./AddActivity";
import AddSleep from "./AddSleep";
import { useEffect, useMemo } from "react";

type ModalState = {
  isAddFoodModalVisible: boolean;
  setAddFoodModalVisible: (val: boolean) => void;
  isActivityModalVisible: boolean;
  setActivityModalVisible: (val: boolean) => void;
  isSleepModalVisible: boolean;
  setSleepModalVisible: (val: boolean) => void;
  currentActivity: any; // add a type here
  setCurrentActivity: (val: any) => void; // add a type here
  currentMeal: any; // add a type here
  setCurrentMeal: (val: any) => void; // add a type here
  currentSleep: any; // add a type here
  setCurrentSleep: (val: any) => void; // add a type here
};

type ReUsableModalProps = {
  modalState: ModalState;
};

const ReUsableModal = ({ modalState }: ReUsableModalProps) => {
  const {
    isAddFoodModalVisible,
    setAddFoodModalVisible,
    isActivityModalVisible,
    setActivityModalVisible,
    isSleepModalVisible,
    setSleepModalVisible,
    currentActivity,
    setCurrentActivity,
    currentMeal,
    setCurrentMeal,
    currentSleep,
    setCurrentSleep,
  } = modalState;

  useEffect(() => {
    if (isAddFoodModalVisible) {
      setActivityModalVisible(false);
      setSleepModalVisible(false);
    }
    if (isActivityModalVisible) {
      setAddFoodModalVisible(false);
      setSleepModalVisible(false);
    }
    if (isSleepModalVisible) {
      setAddFoodModalVisible(false);
      setActivityModalVisible(false);
    }
  }, [isAddFoodModalVisible, isActivityModalVisible, isSleepModalVisible]);

  const state =
    isAddFoodModalVisible || isActivityModalVisible || isSleepModalVisible;

  const setter = useMemo(() => {
    if (isAddFoodModalVisible) {
      return setAddFoodModalVisible;
    }
    if (isActivityModalVisible) {
      return setActivityModalVisible;
    }
    if (isSleepModalVisible) {
      return setSleepModalVisible;
    }
  }, [isAddFoodModalVisible, isActivityModalVisible, isSleepModalVisible]);

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={state}
      onRequestClose={() => {
        setter(!state);
      }}
    >
      {/* NA: Make this into a component and then use it here. */}
      <TouchableWithoutFeedback
        onPress={() => {
          setter(false);
          setCurrentActivity(null);
          setCurrentMeal(null);
          setCurrentSleep(null);
        }}
      >
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {isAddFoodModalVisible && (
                <AddFood
                  setAddFoodModalVisible={setAddFoodModalVisible}
                  currentMeal={currentMeal}
                  setCurrentMeal={setCurrentMeal}
                />
              )}
              {isActivityModalVisible && (
                <AddActivity
                  setActivityModalVisible={setActivityModalVisible}
                  currentActivity={currentActivity}
                  setCurrentActivity={setCurrentActivity}
                />
              )}
              {isSleepModalVisible && (
                <AddSleep
                  setSleepModalVisible={setSleepModalVisible}
                  currentSleep={currentSleep}
                  setCurrentSleep={setCurrentSleep}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    borderWidth: 1,
    borderColor: "#000",
  },
});

export default ReUsableModal;
