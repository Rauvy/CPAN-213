import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAW4NC9UBr2VSA_1rV9VDfR2FiP-oxFNi0",
  authDomain: "cpan-213-b40d1.firebaseapp.com",
  projectId: "cpan-213-b40d1",
  storageBucket: "cpan-213-b40d1.firebasestorage.app",
  messagingSenderId: "883506062899",
  appId: "1:883506062899:web:a1ebb157a69400b5242546",
  measurementId: "G-5FPD7MVBLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const BooksStore = () => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [books, setBooks] = useState([]);

  useEffect(() => {
    console.log("Setting up Firestore listener...");
    const unsubscribe = onSnapshot(collection(db, "books"), (querySnapshot) => {
      console.log("Received Firestore update with", querySnapshot.size, "documents");
      const booksList = [];
      querySnapshot.forEach((doc) => {
        if (doc.data().title && doc.data().author_name) { // Only add if both fields exist
          booksList.push({ id: doc.id, ...doc.data() });
        }
      });
      setBooks(booksList);
    }, (error) => {
      console.error("Firestore error:", error);
    });

    return () => unsubscribe(); 
  }, []);

  const deleteBook = async (bookId) => {
    try {
      await deleteDoc(doc(db, "books", bookId));
      console.log("Book deleted!");
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };

  const addBook = async () => {
    if (title.trim() === "" || author.trim() === "") {
      alert("Please enter book title and author name!");
      return;
    }

    try {
      await addDoc(collection(db, "books"), {
        title: title,
        author_name: author
      });
      console.log("Book Added!");
      setTitle("");
      setAuthor("");
    } catch (error) {
      console.error("Error adding book: ", error);
    }
  };

  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author_name}</Text>
      </View>
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={() => deleteBook(item.id)}
      >
        <Text style={styles.deleteButtonText}>×</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Book List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Enter Book Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#666"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter Author Name"
          value={author}
          onChangeText={setAuthor}
          placeholderTextColor="#666"
        />
        <TouchableOpacity style={styles.addButton} onPress={addBook}>
          <Text style={styles.addButtonText}>Add Book</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        renderItem={renderBookItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
  },
  bookItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookInfo: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: '#333',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#666',
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    lineHeight: 24,
  },
});

export default BooksStore;
