import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { getUserTracking } from "../app/shared/api";
import { UserContext } from "../app/_layout";
import { router } from "expo-router";

const TrackingList = () => {
  const { user, setTrackingData }: any = useContext(UserContext);
  const [trackingList, setTrackingList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      const { data }: any = user?.user_id ? await getUserTracking(user) : [];

      setTrackingList(data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTrackClick = (data: any) => {
    try {
      setTrackingData(data);
      router.push("/form");
    } catch (err) {
      console.log(err);
    }
  };
  if (isLoading)
    return (
      <View style={styles.activityContainer}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  if (!isLoading && !trackingList.length)
    return (
      <View style={styles.activityContainer}>
        <Text style={styles.noDataText}>No Task Initiated</Text>
      </View>
    );
  return (
    <ScrollView style={styles.container}>
      {trackingList.map((data, index) => (
        <View key={index} style={styles.card}>
          <Text
            style={styles.title}
            onPress={() => {
              handleTrackClick(data);
            }}
          >
            {data.tracking_title} - {data.node_title}
          </Text>
          <Text style={styles.description}>{data.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  activityContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noDataText: { fontWeight: "bold", fontSize: 16, color: "green" },
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#28a745",
  },
  description: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#666",
    marginRight: 10,
  },
  taskBadge: {
    backgroundColor: "#28a745",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginRight: 20,
  },
  notificationBadge: {
    backgroundColor: "#28a745",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default TrackingList;
