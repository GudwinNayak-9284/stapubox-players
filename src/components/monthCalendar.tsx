// src/components/MonthCalendar.tsx
import React, { useState, useEffect, useMemo } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { Colors } from "../theme/colors";
import dayjs from "dayjs";
import { Ionicons } from "@expo/vector-icons"; // 👈 import icons

type Props = {
  months: string[];
  highlighted: Set<string>;
  activeDate: string | null;
  currentMonth: string;
  onDayPress: (ymd: string) => void;
  loading?: boolean;
  onMonthChange?: (month: string) => void;
};

export default function MonthCalendar({
  highlighted,
  activeDate,
  currentMonth,
  onDayPress,
  loading,
  onMonthChange,
}: Props) {
  const [displayedMonth, setDisplayedMonth] = useState(currentMonth);

  useEffect(() => {
    setDisplayedMonth(currentMonth);
  }, [currentMonth]);

  
  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
        <Text style={styles.loadingText}>Loading calendar…</Text>
      </View>
    );
  }
  const markedDates = useMemo(() => {
    const marked: Record<string, any> = {};
  
    highlighted.forEach((date) => {
      marked[date] = {
        marked: false,
        dotColor: "#000",
        customStyles: {
          text: { color: "#000", fontWeight: "900" }, // dark bold text
        },
      };
    });
  
    if (activeDate) {
      marked[activeDate] = {
        ...marked[activeDate],
        selected: true,
        selectedColor: Colors.primary,
        selectedTextColor: "#fff",
      };
    }
  
    return marked;
  }, [highlighted, activeDate]);
  

  return (
    <View style={styles.wrap}>
      <Calendar
        current={activeDate || dayjs(`${displayedMonth}-01`).format("YYYY-MM-DD")}
        onDayPress={(day) => onDayPress(day.dateString)}
        onMonthChange={(month) => {
          const monthString = dayjs(month.dateString).format("YYYY-MM");
          if (monthString < "2025-08" || monthString > "2025-10") return;

          setDisplayedMonth(monthString);
          onMonthChange?.(monthString);
        }}
        markedDates={markedDates}
        markingType="custom"
        theme={{
          selectedDayBackgroundColor: Colors.primary,
          selectedDayTextColor: "#fff",
          todayTextColor: Colors.primary,
          dayTextColor: Colors.text,
          textDisabledColor: "#d0d0d0",
          arrowColor: Colors.primary,
          monthTextColor: Colors.text,
          indicatorColor: Colors.primary,
          textDayFontWeight: "600",
          textMonthFontWeight: "700",
          textDayHeaderFontWeight: "500",
        }}
        
        hideExtraDays
        firstDay={1}
        minDate="2025-08-01"
        maxDate="2025-10-31"
        renderArrow={(direction) =>
          direction === "left" ? (
            <Ionicons name="chevron-back" size={24} color={Colors.primary} />
          ) : (
            <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
  },
  loading: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  loadingText: {
    color: Colors.subtext,
    marginTop: 6,
  },
});
