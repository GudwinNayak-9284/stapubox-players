// src/components/TournamentList.tsx
import React from "react";
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // 👈 import SafeAreaView
import { Tournament } from "../types";
import { Colors } from "../theme/colors";
import TournamentCard from "./tournamentCard";

export default function TournamentList({
  tournaments,
  loading,
}: {
  tournaments: Tournament[];
  loading?: boolean;
}) {
  if (loading && tournaments.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
        <Text style={{ color: Colors.subtext, marginTop: 8 }}>
          Loading tournaments…
        </Text>
      </View>
    );
  }

  if (!loading && tournaments.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: Colors.subtext }}>No data</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        contentContainerStyle={{  paddingBottom: 20 }}
        data={tournaments}
        keyExtractor={(t) => String(t.id)}
        renderItem={({ item }) => <TournamentCard tournament={item} />}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  center: { alignItems: "center", paddingVertical: 24 },
});
