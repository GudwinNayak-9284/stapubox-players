import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect, useRef } from "react";
import {
  View,
  StyleSheet,
  Platform,
  StatusBar as RNStatusBar,
  FlatList,
  Animated,
  Text,
} from "react-native";
import {
  SafeAreaProvider,
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import SportsDropdown from "./src/components/sportsDropdown";
import MonthCalendar from "./src/components/monthCalendar";
import TournamentCard from "./src/components/tournamentCard";
import { useSports } from "./src/hooks/useSports";
import { useTournamentData } from "./src/hooks/useTournament";
import { Colors } from "./src/theme/colors";
import { SportsId } from "./src/types";
import dayjs from "dayjs";

function useShimmer() {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  return shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: ["#e0e0e0", "#f5f5f5"],
  });
}

function TournamentSkeleton() {
  const backgroundColor = useShimmer();
  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={[styles.skeletonImage, { backgroundColor }]} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Animated.View
          style={[styles.skeletonLine, { width: "60%", backgroundColor }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: "40%", backgroundColor, marginTop: 6 },
          ]}
        />
      </View>
    </View>
  );
}

function DropdownSkeleton() {
  const backgroundColor = useShimmer();
  return (
    <View style={styles.dropdownSkeleton}>
      <Animated.View style={[styles.dropdownBox, { backgroundColor }]} />
    </View>
  );
}

function CalendarSkeleton() {
  const backgroundColor = useShimmer();
  return (
    <View style={styles.calendarSkeleton}>
      <View style={styles.calendarHeader}>
        <Animated.View style={[styles.arrowBox, { backgroundColor }]} />
        <Animated.View style={[styles.monthBox, { backgroundColor }]} />
        <Animated.View style={[styles.arrowBox, { backgroundColor }]} />
      </View>
      <View style={styles.datesRow}>
        {Array.from({ length: 7 }).map((_, i) => (
          <Animated.View
            key={i}
            style={[styles.dateCircle, { backgroundColor }]}
          />
        ))}
      </View>
    </View>
  );
}

function MainApp() {
  const { sports, selectedId, setSelectedId, loading: sportsLoading } =
    useSports();
  const [displayedMonth, setDisplayedMonth] = useState(
    dayjs().format("YYYY-MM")
  );
  const insets = useSafeAreaInsets();

  const {
    calendarDates,
    tournamentsForSelectedDate,
    setActiveDate,
    activeDate,
    loading: tournLoading,
  } = useTournamentData(selectedId as SportsId | "ALL", displayedMonth);

  const renderHeader = () =>
    tournLoading ? (
      <CalendarSkeleton />
    ) : (
      <MonthCalendar
        months={["2025-08", "2025-09", "2025-10"]}
        highlighted={calendarDates}
        activeDate={activeDate}
        currentMonth={displayedMonth}
        onDayPress={(dateString) =>
          activeDate === dateString
            ? setActiveDate(null)
            : setActiveDate(dateString)
        }
        loading={tournLoading && !activeDate}
        onMonthChange={(month) => {
          setDisplayedMonth(month);
          setActiveDate(null);
        }}
      />
    );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {!tournLoading &&
        (activeDate ? (
          <>
            <Text style={styles.emptyText}>No tournaments on {activeDate}</Text>
            <Text style={styles.emptySubtext}>
              Select a different date or sport
            </Text>
          </>
        ) : (
          <Text style={styles.emptyText}>
            No tournaments available for selected sport in the current date
            range
          </Text>
        ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        {sportsLoading ? (
          <DropdownSkeleton />
        ) : (
          <SportsDropdown
            sports={sports}
            loading={sportsLoading}
            selectedId={selectedId}
            onChange={(newId) => setSelectedId(newId)}
          />
        )}
      </View>

      <FlatList
        ListHeaderComponent={renderHeader}
        data={
          tournLoading ? Array.from({ length: 5 }) : tournamentsForSelectedDate
        }
        keyExtractor={(item: any, index) =>
          tournLoading ? String(index) : String(item.id)
        }
        renderItem={({ item }) =>
          tournLoading ? (
            <TournamentSkeleton />
          ) : (
            <TournamentCard tournament={item} />
          )
        }
        ItemSeparatorComponent={() => <View style={styles.cardDivider} />}
        contentContainerStyle={[
          styles.listContainer,
          { paddingBottom: insets.bottom + 20 },
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
    textAlign: "center",
  },
  emptySubtext: {
    color: Colors.subtext,
    marginTop: 4,
    fontSize: 14,
    textAlign: "center",
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.divider,
    marginVertical: 8,
  },
  skeletonCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    backgroundColor: Colors.bg,
    borderRadius: 8,
  },
  skeletonImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  skeletonLine: {
    height: 14,
    borderRadius: 4,
  },
  dropdownSkeleton: {
    paddingVertical: 12,
  },
  dropdownBox: {
    height: 42,
    borderRadius: 6,
  },
  calendarSkeleton: {
    padding: 16,
  },
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  arrowBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  monthBox: {
    width: 120,
    height: 80,
    borderRadius: 6,
  },
  datesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
