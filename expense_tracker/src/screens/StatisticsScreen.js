import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LineChart, BarChart } from 'react-native-chart-kit';

const { width } = Dimensions.get('window');

// Mock data for statistics
const statisticsData = {
  weekly: {
    totalSpent: 524.35,
    topCategories: [
      { name: 'Food', amount: 215.75, percentage: 41, color: '#FF6384', icon: 'fast-food' },
      { name: 'Transport', amount: 148.50, percentage: 28, color: '#36A2EB', icon: 'car' },
      { name: 'Shopping', amount: 95.40, percentage: 18, color: '#FFCE56', icon: 'cart' },
    ],
    trend: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [
        {
          data: [65, 45, 112, 78, 98, 75, 51],
          color: (opacity = 1) => `rgba(39, 110, 241, ${opacity})`,
        }
      ]
    },
    breakdown: {
      labels: ['Food', 'Transport', 'Shopping', 'Bills', 'Other'],
      datasets: [
        {
          data: [215.75, 148.50, 95.40, 35.20, 29.50]
        }
      ]
    }
  },
  monthly: {
    totalSpent: 2150.80,
    topCategories: [
      { name: 'Food', amount: 750.25, percentage: 35, color: '#FF6384', icon: 'fast-food' },
      { name: 'Bills', amount: 435.65, percentage: 20, color: '#4BC0C0', icon: 'flash' },
      { name: 'Shopping', amount: 395.75, percentage: 18, color: '#FFCE56', icon: 'cart' },
    ],
    trend: {
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
      datasets: [
        {
          data: [485, 590, 512, 563],
          color: (opacity = 1) => `rgba(39, 110, 241, ${opacity})`,
        }
      ]
    },
    breakdown: {
      labels: ['Food', 'Bills', 'Shopping', 'Transport', 'Other'],
      datasets: [
        {
          data: [750.25, 435.65, 395.75, 320.40, 248.75]
        }
      ]
    }
  },
  yearly: {
    totalSpent: 24680.55,
    topCategories: [
      { name: 'Bills', amount: 7850.45, percentage: 32, color: '#4BC0C0', icon: 'flash' },
      { name: 'Food', amount: 6750.80, percentage: 27, color: '#FF6384', icon: 'fast-food' },
      { name: 'Shopping', amount: 4250.65, percentage: 17, color: '#FFCE56', icon: 'cart' },
    ],
    trend: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          data: [1850, 1720, 2105, 1960, 2085, 1995, 2230, 2150, 1980, 2305, 2180, 2120],
          color: (opacity = 1) => `rgba(39, 110, 241, ${opacity})`,
        }
      ]
    },
    breakdown: {
      labels: ['Bills', 'Food', 'Shopping', 'Transport', 'Entertainment', 'Other'],
      datasets: [
        {
          data: [7850.45, 6750.80, 4250.65, 2980.35, 1548.20, 1300.10]
        }
      ]
    }
  }
};

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
  color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 0.7,
  decimalPlaces: 0,
  style: {
    borderRadius: 16
  },
};

const StatisticsScreen = () => {
  const [timeframe, setTimeframe] = useState('weekly');
  const data = statisticsData[timeframe];
  
  const renderTimeframeButton = (label, value) => (
    <TouchableOpacity 
      style={[
        styles.timeframeButton, 
        timeframe === value && styles.activeTimeframeButton
      ]}
      onPress={() => setTimeframe(value)}
    >
      <Text 
        style={[
          styles.timeframeText, 
          timeframe === value && styles.activeTimeframeText
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.screenPadding}>
          {/* Header Section */}
          <View style={styles.headerContainer}>
            <View style={styles.headerTop}>
              <Text style={styles.sectionTitle}>Statistics</Text>
              <Ionicons name="stats-chart" size={24} color="#276EF1" />
            </View>
            
            <View style={styles.timeframeButtons}>
              {renderTimeframeButton('Weekly', 'weekly')}
              {renderTimeframeButton('Monthly', 'monthly')}
              {renderTimeframeButton('Yearly', 'yearly')}
            </View>
          </View>
          
          {/* Overview Card */}
          <View style={styles.card}>
            <Text style={styles.cardLabel}>
              {timeframe === 'weekly' ? 'This Week' : timeframe === 'monthly' ? 'This Month' : 'This Year'}
            </Text>
            <Text style={styles.totalAmount}>${data.totalSpent.toFixed(2)}</Text>
            <Text style={styles.totalLabel}>Total Expenses</Text>
          </View>
          
          {/* Spending Trend Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Spending Trend</Text>
              <Text style={styles.sectionSubtitle}>
                {timeframe === 'weekly' ? 'Last 7 days' : timeframe === 'monthly' ? 'Last 4 weeks' : 'Last 12 months'}
              </Text>
            </View>
            
            <View style={styles.chartContainer}>
              <LineChart
                data={data.trend}
                width={width - 60}
                height={220}
                chartConfig={chartConfig}
                bezier
                style={styles.chart}
              />
            </View>
          </View>
          
          {/* Top Categories Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Top Categories</Text>
              <Text style={styles.sectionSubtitle}>Where you spend the most</Text>
            </View>
            
            {data.topCategories.map((category, index) => (
              <View key={index} style={styles.categoryItem}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon} size={20} color="#FFFFFF" />
                </View>
                
                <View style={styles.categoryInfo}>
                  <View style={styles.categoryNameRow}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryAmount}>${category.amount.toFixed(2)}</Text>
                  </View>
                  
                  <View style={styles.progressBarContainer}>
                    <View 
                      style={[
                        styles.progressBar, 
                        { width: `${category.percentage}%`, backgroundColor: category.color }
                      ]} 
                    />
                  </View>
                  
                  <Text style={styles.categoryPercentage}>{category.percentage}% of total</Text>
                </View>
              </View>
            ))}
          </View>
          
          {/* Expense Breakdown Section */}
          <View style={styles.sectionCard}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Expense Breakdown</Text>
              <Text style={styles.sectionSubtitle}>Categories comparison</Text>
            </View>
            
            <View style={styles.chartContainer}>
              <BarChart
                data={data.breakdown}
                width={width - 60}
                height={220}
                chartConfig={{
                  ...chartConfig,
                  color: (opacity = 1) => `rgba(75, 192, 192, ${opacity})`,
                }}
                style={styles.chart}
                showValuesOnTopOfBars
                fromZero
              />
            </View>
          </View>
          
          {/* Money-Saving Tips */}
          <View style={styles.tipsCard}>
            <View style={styles.tipsHeader}>
              <Ionicons name="bulb" size={24} color="#FFCE56" />
              <Text style={styles.tipsTitle}>Smart Saving Tip</Text>
            </View>
            <Text style={styles.tipsText}>
              {timeframe === 'weekly' 
                ? "Try meal prepping on weekends to reduce food expenses on weekdays!"
                : timeframe === 'monthly'
                ? "Consider reviewing your subscription services - you might be paying for services you rarely use."
                : "Set up automatic transfers to a savings account to build your emergency fund over the year."}
            </Text>
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
  headerContainer: {
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  timeframeButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 4,
  },
  timeframeButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTimeframeButton: {
    backgroundColor: '#276EF1',
  },
  timeframeText: {
    color: '#666666',
    fontWeight: '500',
  },
  activeTimeframeText: {
    color: '#ffffff',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  cardLabel: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  totalLabel: {
    fontSize: 14,
    color: '#666666',
    marginTop: 5,
  },
  sectionCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  sectionHeader: {
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
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  chart: {
    borderRadius: 12,
    marginVertical: 8,
  },
  categoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#252525',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '500',
  },
  categoryAmount: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#333333',
    borderRadius: 3,
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666666',
  },
  tipsCard: {
    backgroundColor: '#252525',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFCE56',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipsTitle: {
    fontSize: 16,
    color: '#FFCE56',
    fontWeight: '600',
    marginLeft: 10,
  },
  tipsText: {
    fontSize: 14,
    color: '#ffffff',
    lineHeight: 20,
  },
});

export default StatisticsScreen; 