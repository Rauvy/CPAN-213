import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// Mock data
const totalEarned = 3500;
const totalSpent = 1050;

const categoryData = [
  {
    name: 'Food',
    amount: 450,
    color: '#FF6384',
    legendFontColor: '#FFFFFF',
    legendFontSize: 12,
  },
  {
    name: 'Transport',
    amount: 250,
    color: '#36A2EB',
    legendFontColor: '#FFFFFF',
    legendFontSize: 12,
  },
  {
    name: 'Shopping',
    amount: 200,
    color: '#FFCE56',
    legendFontColor: '#FFFFFF',
    legendFontSize: 12,
  },
  {
    name: 'Bills',
    amount: 150,
    color: '#4BC0C0',
    legendFontColor: '#FFFFFF',
    legendFontSize: 12,
  },
];

const recentExpenses = [
  {
    id: 1,
    title: 'Grocery Shopping',
    category: 'Food',
    amount: 85.25,
    date: '15 Jun',
    icon: 'fast-food',
    color: '#FF6384',
  },
  {
    id: 2,
    title: 'Uber Ride',
    category: 'Transport',
    amount: 24.50,
    date: '14 Jun',
    icon: 'car',
    color: '#36A2EB',
  },
  {
    id: 3,
    title: 'New Headphones',
    category: 'Shopping',
    amount: 159.99,
    date: '12 Jun',
    icon: 'cart',
    color: '#FFCE56',
  },
];

const HomeScreen = () => {
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientTo: '#08130D',
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.screenPadding}>
          {/* Overview Section */}
          <View style={styles.overviewContainer}>
            <View style={styles.overviewHeader}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <Ionicons name="wallet-outline" size={24} color="#276EF1" />
            </View>
            
            <Text style={styles.balance}>$2,450.00</Text>
            <Text style={styles.balanceLabel}>Total Balance</Text>
          </View>
          
          {/* Tiles for Total Earned and Total Spent */}
          <View style={styles.tilesContainer}>
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>Total Earned</Text>
              <Text style={[styles.tileAmount, styles.earnedAmount]}>${totalEarned.toFixed(2)}</Text>
              <View style={styles.tileIconContainer}>
                <Ionicons name="trending-up" size={24} color="#4BC0C0" />
              </View>
            </View>
            
            <View style={styles.tile}>
              <Text style={styles.tileLabel}>Total Spent</Text>
              <Text style={[styles.tileAmount, styles.spentAmount]}>${totalSpent.toFixed(2)}</Text>
              <View style={styles.tileIconContainer}>
                <Ionicons name="trending-down" size={24} color="#FF6384" />
              </View>
            </View>
          </View>
          
          {/* Activity Section with Pie Chart */}
          <View style={styles.activityContainer}>
            <Text style={styles.sectionTitle}>Activity</Text>
            <Text style={styles.sectionSubtitle}>Spending by Category</Text>
            
            <View style={styles.chartContainer}>
              <PieChart
                data={categoryData}
                width={width - 40}
                height={200}
                chartConfig={chartConfig}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          </View>
          
          {/* Recent Expenses */}
          <View style={styles.expenseContainer}>
            <Text style={styles.sectionTitle}>Recent Expenses</Text>
            
            {recentExpenses.map((expense) => (
              <View key={expense.id} style={styles.expenseItem}>
                <View style={[styles.expenseIcon, { backgroundColor: expense.color }]}>
                  <Ionicons name={expense.icon} size={20} color="#FFFFFF" />
                </View>
                
                <View style={styles.expenseInfo}>
                  <Text style={styles.expenseTitle}>{expense.title}</Text>
                  <Text style={styles.expenseCategory}>{expense.category}</Text>
                </View>
                
                <View style={styles.expenseDetails}>
                  <Text style={styles.expenseAmount}>-${expense.amount.toFixed(2)}</Text>
                  <Text style={styles.expenseDate}>{expense.date}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  screenPadding: {
    padding: 20,
  },
  overviewContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  overviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  balance: {
    fontSize: 36,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  tile: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 15,
    width: '48%',
    position: 'relative',
    overflow: 'hidden',
  },
  tileLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
  },
  tileAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  earnedAmount: {
    color: '#4BC0C0',
  },
  spentAmount: {
    color: '#FF6384',
  },
  tileIconContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0.8,
  },
  activityContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    color: '#ffffff',
    fontWeight: '600',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 20,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  expenseContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
  },
  expenseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  expenseIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  expenseInfo: {
    flex: 1,
  },
  expenseTitle: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  expenseCategory: {
    fontSize: 13,
    color: '#666666',
    marginTop: 3,
  },
  expenseDetails: {
    alignItems: 'flex-end',
  },
  expenseAmount: {
    fontSize: 16,
    color: '#FF6384',
    fontWeight: '600',
  },
  expenseDate: {
    fontSize: 13,
    color: '#666666',
    marginTop: 3,
  },
});

export default HomeScreen; 