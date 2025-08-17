import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AddNoteModal from "../../components/AddNoteModal";
import NoteList from "../../components/NoteList";

const NoteScreen = () => {
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allNotes, setAllNotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [newNote, setNewNote] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    // setLoading(true);
    if (loading || loadingMore) return;

    try {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      const response = await fetch(
        `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=10`
      );
      if (!response.ok) {
        return setError("Failed to fetch notes");
      }
      const data = await response.json();
      const formattedNotes = data.map((note) => {
        return {
          id: note.id.toString(),
          text: note.title,
        };
      });
      // setNotes(formattedNotes);
      setAllNotes((prevNotes) =>
        page === 1 ? formattedNotes : [...prevNotes, ...formattedNotes]
      );

      setHasMore(data.length === 10);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const addNote = async () => {
    if (newNote.trim() === "") return;

    try {
      setLoading(true);
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: JSON.stringify({
            title: newNote,
            userId: 1,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to add note");
      }

      const data = await response.json();

      setAllNotes((prevNotes) => [
        {
          id: data.id.toString(),
          text: data.title,
        },
        ...prevNotes,
      ]);

      setNewNote("");
      setModalVisible(false);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      {loading && page === 1 ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <>
          <NoteList
            notes={allNotes}
            onEndReached={() => {
              if (hasMore) fetchNotes();
            }}
            loadingMore={loadingMore}
          />

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addButtonText}>+ Add Note</Text>
          </TouchableOpacity>
          <AddNoteModal
            setModalVisible={setModalVisible}
            modalVisible={modalVisible}
            newNote={newNote}
            setNewNote={setNewNote}
            addNote={addNote}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  addButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },

  addButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default NoteScreen;
