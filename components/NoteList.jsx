import { ActivityIndicator, FlatList, StyleSheet, View } from "react-native";
import NoteItem from "./NoteItem";

const NoteList = ({ notes, onEndReached, loadingMore }) => {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoteItem note={item} />}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.1}
        ListFooterComponent={
          loadingMore ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" />
            </View>
          ) : null
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NoteList;
