import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import { Text, Card, FAB, IconButton } from 'react-native-paper';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../config/firebase';

const ParkingListScreen = ({ navigation }) => {
  const [parkings, setParkings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'parkings'), orderBy('dateTime', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const parkingList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setParkings(parkingList);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'parkings', id));
    } catch (error) {
      console.error('Error deleting parking:', error);
    }
  };

  const renderItem = ({ item }) => (
    <Card style={styles.card} onPress={() => navigation.navigate('ParkingDetail', { parking: item })}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.buildingCodeContainer}>
            <IconButton icon="office-building" size={20} iconColor="#888" />
            <Text style={styles.buildingCode}>{item.buildingCode}</Text>
          </View>
          <IconButton 
            icon="delete" 
            size={20} 
            iconColor="#ff4444"
            onPress={() => handleDelete(item.id)}
          />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconButton icon="clock-outline" size={20} iconColor="#888" />
            <Text style={styles.infoText}>
              {item.dateTime.toDate().toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <IconButton icon="timer-outline" size={20} iconColor="#888" />
            <Text style={styles.infoText}>{item.hours} hours</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <IconButton icon="car" size={20} iconColor="#888" />
            <Text style={styles.infoText}>{item.licensePlate}</Text>
          </View>
          <View style={styles.infoItem}>
            <IconButton icon="map-marker" size={20} iconColor="#888" />
            <Text style={styles.infoText} numberOfLines={1}>{item.streetAddress}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={parkings}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#4CAF50"
            colors={['#4CAF50']}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No parking records found</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('AddParking')}
        color="#fff"
        backgroundColor="#4CAF50"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    backgroundColor: '#1E1E1E',
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  buildingCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buildingCode: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#888',
    marginLeft: 8,
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
});

export default ParkingListScreen; 