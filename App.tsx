// App.tsx
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
  FlatList,
  ActivityIndicator,
  Text,
} from "react-native";
import { SafeAreaProvider, SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import SportsDropdown from "./src/components/sportsDropdown";
import MonthCalendar from "./src/components/monthCalendar";
import TournamentCard from "./src/components/tournamentCard";
import { useSports } from "./src/hooks/useSports";
import { useTournamentData } from "./src/hooks/useTournament";
import { Colors } from "./src/theme/colors";
import { SportsId } from "./src/types";
import dayjs from "dayjs";

function MainApp() {
  const { sports, selectedId, setSelectedId, loading: sportsLoading } = useSports();
  const [displayedMonth, setDisplayedMonth] = useState(dayjs().format("YYYY-MM"));
  const insets = useSafeAreaInsets();

  const {
    calendarDates,
    tournamentsForSelectedDate,
    setActiveDate,
    activeDate,
    loading: tournLoading,
  } = useTournamentData(selectedId as SportsId | "ALL",displayedMonth);

  const renderHeader = () => (
    <MonthCalendar
      months={["2025-08", "2025-09", "2025-10"]}
      highlighted={calendarDates}
      activeDate={activeDate}
      currentMonth={displayedMonth}
      onDayPress={(dateString) => {
        if (activeDate === dateString) {
          setActiveDate(null);
        } else {
          setActiveDate(dateString);
        }
      }}
      loading={tournLoading && !activeDate}
      onMonthChange={(month) => {
        setDisplayedMonth(month);
        setActiveDate(null);
      }}
    />
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {tournLoading ? (
        <>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.emptyText}>Loading tournaments...</Text>
        </>
      ) : activeDate ? (
        <>
          <Text style={styles.emptyText}>No tournaments on {activeDate}</Text>
          <Text style={styles.emptySubtext}>Select a different date or sport</Text>
        </>
      ) : tournamentsForSelectedDate.length === 0 ? (
        <Text style={styles.emptyText}>
          No tournaments available for selected sport in the current date range
        </Text>
      ) : null}
    </View>
  );

  const renderItemSeparator = () => <View style={styles.cardDivider} />;

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <SportsDropdown
          sports={sports}
          loading={sportsLoading}
          selectedId={selectedId}
          onChange={(newId) => setSelectedId(newId)}
        />
      </View>

      {/* Tournament List */}
      <FlatList
        ListHeaderComponent={renderHeader}
        data={tournamentsForSelectedDate}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <TournamentCard tournament={item} />}
        ItemSeparatorComponent={renderItemSeparator}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 20 }, // ✅ Safe bottom spacing
        ]}
        ListEmptyComponent={renderEmptyComponent}
        showsVerticalScrollIndicator={false}
      />

      <StatusBar />
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <MainApp />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: Platform.OS === "android" ? RNStatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: 16,
    backgroundColor: Colors.bg,
    zIndex: 20,
  },
  listContainer: {
    paddingBottom: 40,
  },
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    color: Colors.subtext,
    marginTop: 8,
    fontSize: 16,
  },
  emptySubtext: {
    color: Colors.subtext,
    marginTop: 4,
    fontSize: 14,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 8,
  },
});
