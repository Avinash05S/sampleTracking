import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { MaterialIcons, Feather, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useContext } from "react";
import { UserContext } from "../app/_layout";

export default function Header() {
  const { setTrackingData, setUser } = useContext(UserContext);
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftContainer}>
        <Pressable>
          <MaterialIcons name="menu" size={28} color="black" />
        </Pressable>
        <Image
          source={{ uri: "https://your-logo-url.com/logo.png" }} // Replace with your logo URL
          style={styles.logo}
        />
      </View>
      <View style={styles.rightContainer}>
        <Pressable onPress={() => router.push("/notification")}>
          <Feather name="bell" size={24} color="green" />
          <View style={styles.notificationDot} />
        </Pressable>
        <Pressable
          onPress={() => {
            setUser({});
            setTrackingData({});
            router.push("/");
          }}
        >
          <Ionicons name="power" size={24} color="green" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    height: 60,
    backgroundColor: "#fff",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 50,
    height: 30,
    resizeMode: "contain",
    marginLeft: 10,
  },
  rightContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notificationDot: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 10,
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  profileTextContainer: {
    marginLeft: 10,
  },
  profileName: {
    fontSize: 14,
    fontWeight: "bold",
  },
  profileRole: {
    fontSize: 12,
    color: "gray",
  },
});
