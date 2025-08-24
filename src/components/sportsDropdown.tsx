import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { Colors } from "../theme/colors";
import { Sport } from "../types";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  sports: Sport[];
  selectedId: number | "ALL";
  onChange: (id: number | "ALL") => void;
  loading?: boolean;
};

export default function SportsDropdown({
  sports,
  selectedId,
  onChange,
  loading,
}: Props) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const sportsWithAll: (Sport | { id: "ALL"; name: string })[] = [
    { id: "ALL", name: "ALL" },
    ...sports,
  ];

  const filteredSports = sportsWithAll.filter((s) =>
    (s.name ?? "").toLowerCase().includes(query.toLowerCase())
  );

  const selectedSport =
    selectedId === "ALL"
      ? { id: "ALL", name: "ALL" }
      : sports.find((s) => s.id === selectedId);

  return (
    <View style={styles.wrapper}>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Search your sport"
          value={isTyping ? query : selectedSport?.name || ""}
          onChangeText={(text) => {
            setQuery(text);
            setIsTyping(true);
            setOpen(text.trim().length > 0);
          }}
          onFocus={() => {
            setIsTyping(true);
            if (query.trim().length > 0) setOpen(true);
          }}
          onBlur={() => {
            setOpen(false);
            setQuery("");
            setIsTyping(false);
          }}
        />

        {loading ? (
          <ActivityIndicator size="small" />
        ) : (
          <Ionicons
            name={open ? "chevron-up" : "chevron-down"}
            size={20}
            color="gray"
          />
        )}
      </View>

      {open && query.trim().length > 0 && (
        <View style={styles.dropdown}>
          <FlatList
            keyboardShouldPersistTaps="handled"
            data={filteredSports}
            keyExtractor={(s) => String(s.id)}
            renderItem={({ item }) => {
              const isSelected = selectedId === item.id;

              return (
                <TouchableOpacity
                  style={[styles.option, isSelected && styles.optionSelected]}
                  onPress={() => {
                    onChange(item.id === "ALL" ? "ALL" : Number(item.id));
                    setQuery("");
                    setOpen(false);
                    setIsTyping(false);
                  }}
                >
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {(item.name ?? "").toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <Text style={styles.noData}>No sports found for "{query}"</Text>
            }
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    backgroundColor: Colors.primaryLight,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  dropdown: {
    position: "absolute",
    top: 48,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.divider,
    borderRadius: 12,
    maxHeight: 260,
    zIndex: 30,
    elevation: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
  },
  optionSelected: {
    backgroundColor: Colors.primary + "10",
  },
  optionText: {
    fontSize: 14,
    color: Colors.text,
  },
  optionTextSelected: {
    color: Colors.primary,
    fontWeight: "600",
  },
  noData: {
    padding: 12,
    textAlign: "center",
    color: Colors.subtext,
    fontSize: 14,
  },
});
