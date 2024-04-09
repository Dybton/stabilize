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
      <TouchableWithoutFeedback onPress={() => setter(false)}>
        <View style={styles.modalOverlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContent}>
              {isAddFoodModalVisible && (
                <AddFood setAddFoodModalVisible={setAddFoodModalVisible} />
              )}
              {isActivityModalVisible && (
                <AddActivity
                  setActivityModalVisible={setActivityModalVisible}
                />
              )}
              {isSleepModalVisible && (
                <AddSleep setSleepModalVisible={setSleepModalVisible} />
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
  // modalContent: {
  //   backgroundColor: "white",
  //   padding: 20,
  //   borderRadius: 10,
  //   shadowColor: "#000",
  //   shadowOffset: {
  //     width: 0,
  //     height: 2,
  //   },
  //   shadowOpacity: 0.25,
  //   shadowRadius: 3.84,
  //   elevation: 5,
  // },
});

export default ReUsableModal;
