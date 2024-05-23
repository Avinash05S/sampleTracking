import { useContext, useEffect } from "react";
import { UserContext } from "../app/_layout";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { getForm, createRequest } from "../app/shared/api";

export default function SampleRequestForm() {
  const { trackingData, setTrackingData, user }: any = useContext(UserContext);
  const [formData, setformData] = useState<Record<string, any>>({});
  const [Inputs, setInputs] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      const payload = { node_id: trackingData.default_id };
      const { data } = await getForm(payload);
      setInputs(data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    try {
      const { tracking_id, node_id } = trackingData;
      const { user_id } = user;
      const payload = {
        data: formData,
        tracking_id,
        node_id,
        user_id,
      };
      await createRequest(payload);
      setTrackingData({});
      router.push("/notification");
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (name: string, value: any) => {
    setformData((pre) => {
      pre[name] = value;
      return pre;
    });
  };

  const handleCancel = () => {
    setTrackingData({});
    router.push("/notification");
  };

  if (isLoading)
    return (
      <View style={styles.centerView}>
        <ActivityIndicator size={"large"} />
      </View>
    );
  if (!isLoading && !Inputs.length)
    return (
      <View style={styles.centerView}>
        <Text style={styles.noInput}>No Inputs Found</Text>
      </View>
    );
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Create Sample Request</Text>
      {Inputs.map((val) => {
        return (
          <>
            <Text style={styles.label}>{val.label}</Text>
            <TextInput
              style={styles.input}
              placeholder="Request ID"
              value={formData[val.label]}
              onChangeText={(text) => {
                handleChange(val.label, text);
              }}
            />
          </>
        );
      })}

      <View style={styles.buttonContainer}>
        <Button title="Create" onPress={handleSubmit} color="#28a745" />
        <Button title="Cancel" color="#6c757d" onPress={handleCancel} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centerView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noInput: { fontWeight: "bold", fontSize: 16, color: "green" },
  container: {
    flex: 1,
    padding: 20,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 40,
    width: "100%",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
