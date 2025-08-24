// src/components/TournamentCard.tsx
import React, { JSX, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Colors } from "../theme/colors";
import { Tournament } from "../types";
import { fmtDateRange, fmtTimeIST } from "../utils/date";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type Props = { tournament: Tournament };

const FALLBACK_IMAGE = "https://placehold.co/100x100/png?text=Tournament";

// ✅ Safe mapping with type
const sportIcons: Record<string, JSX.Element> = {
  badminton: <MaterialCommunityIcons name="badminton" size={18} color="#444" />,
  football: <Ionicons name="football" size={18} color="#444" />,
  cricket: <MaterialCommunityIcons name="cricket" size={18} color="#444" />,
  tennis: <Ionicons name="tennisball" size={18} color="#444" />,
};

export default function TournamentCard({ tournament }: Props) {
  const [open, setOpen] = useState(false);
  const [imgUri, setImgUri] = useState(
    tournament.tournament_img_url || FALLBACK_IMAGE
  );

  const hasMatches = (tournament.matches?.length ?? 0) > 0;

  const toggle = () => {
    if (!hasMatches) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  const sportKey = tournament.sport_name?.toLowerCase() || "";

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Image
          source={{ uri: imgUri }}
          style={styles.logo}
          onError={() => setImgUri(FALLBACK_IMAGE)}
        />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{tournament.name}</Text>
          <Text style={styles.sport}>
            {tournament.sport_name ?? "Unknown Sport"}
          </Text>
          <Text style={styles.range}>
            {fmtDateRange(tournament.start_date, tournament.end_date)}
          </Text>
        </View>
        <View style={{ alignItems: "center" }}>
          <Ionicons name="heart-outline" size={24} color="gray" />
          <Text style={styles.level}>{tournament.level ?? "Domestic"}</Text>
        </View>
      </View>

      {/* Expand toggle */}
      {hasMatches && (
        <TouchableOpacity onPress={toggle} style={styles.expandBtn}>
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={22}
            color={Colors.primary}
          />
        </TouchableOpacity>
      )}

      {/* Matches */}
      {open && hasMatches && (
        <View style={styles.matches}>
          {tournament.matches!.map((m) => {
            const safeDate = m.start_time ? new Date(m.start_time) : null;
            return (
              <View key={m.id} style={styles.matchCard}>
                {/* Match header */}
                <View style={styles.matchTop}>
                  {sportIcons[sportKey] ?? (
                    <Ionicons name="trophy-outline" size={18} color="#444" />
                  )}
                  <Text
                    style={styles.matchTitle}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {m.team_a ?? "Team A"} vs {m.team_b ?? "Team B"}
                  </Text>
                  <View style={styles.stageBadge}>
                    <Text style={styles.stageText}>{m.stage ?? "Stage"}</Text>
                  </View>
                </View>

                {/* Teams */}
                <View style={styles.vsRow}>
                  <Image
                    source={{
                      uri: "https://placehold.co/48x48/png?text=Team+A",
                    }}
                    style={styles.teamLogo}
                  />
                  <Text style={styles.vs}>VS</Text>
                  <Image
                    source={{
                      uri: "https://placehold.co/48x48/png?text=Team+B",
                    }}
                    style={styles.teamLogo}
                  />
                </View>

                {/* Date, time, venue */}
                <View style={styles.innerRow}>
                  <View style={styles.infoRow}>
                    <View style={styles.trDate}>
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={Colors.text}
                      />
                      <Text style={styles.infoText}>
                        {safeDate
                          ? safeDate.toLocaleDateString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "TBD"}
                      </Text>
                    </View>
                    <View style={styles.trTime}>
                      <Ionicons
                        name="time-outline"
                        size={18}
                        color={Colors.text}
                        style={{ marginLeft: 16 }}
                      />
                      <Text style={styles.infoText}>
                        {m.start_time ? fmtTimeIST(m.start_time) : "TBD"}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.venue}>
                    <Ionicons
                      name="location-outline"
                      size={18}
                      color={Colors.text}
                    />
                    <Text style={styles.infoText}>{m.venue ?? "TBD"}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 12,
    marginBottom: 4,
    marginTop:4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
  logo: { width: 50, height: 50, borderRadius: 8, marginRight: 10 },
  title: { fontSize: 14, fontWeight: "500", color: Colors.text },
  sport: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 2,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  range: { fontSize: 12, color: Colors.subtext, marginTop: 2 },
  level: { fontSize: 12, color: Colors.secondary, fontWeight: "400" },
  expandBtn: {
    alignItems: "center",
    paddingVertical: 6,
    borderTopColor: Colors.divider,
  },
  matches: { padding: 12, gap: 12 },
  matchCard: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    padding: 10,
    backgroundColor: "#fff",
  },
  matchTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  matchTitle: {
    flex: 1,
    fontWeight: "400",
    color: Colors.text,
    fontSize: 12,
    marginHorizontal: 4,
  },
  stageBadge: {
    flexShrink: 0,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: "#fff4ea",
  },
  stageText: { color: Colors.primary, fontWeight: "400", fontSize: 12 },
  vsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 8,
    gap: 12,
  },
  teamLogo: { width: 60, height: 60 },
  vs: { fontWeight: "700", color: Colors.text },
  innerRow: {
    borderWidth: 1,
    borderRadius: 8,
    marginTop: 6,
    gap: 6,
    borderColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  trDate: { flexDirection: "row", alignItems: "center" },
  trTime: { flexDirection: "row", alignItems: "center" },
  venue: { flexDirection: "row", alignItems: "center" },
  infoText: {
    marginLeft: 6,
    fontSize: 12,
    color: Colors.text,
    fontWeight: "500",
  },
});
