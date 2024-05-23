import React, { Dispatch, SetStateAction, useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { userLogin } from "../app/shared/api";
import { UserContext } from "../app/_layout";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const { data } = await userLogin({ email, password });
      setUser(data);
      router.push("/notification");
      setEmail("");
      setPassword("");
    } catch (err: any) {
      if (err.response) {
        setError(err.response.data || "Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOnChange = (
    setFun: Dispatch<SetStateAction<any>>,
    value: string
  ) => {
    if (error) setError(null);
    setFun(value);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>DTE</Text>
      <Text style={styles.loginText}>User Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        inputMode="email"
        value={email}
        onChangeText={(val) => handleOnChange(setEmail, val)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        secureTextEntry={true}
        onChangeText={(val) => handleOnChange(setPassword, val)}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <Pressable onPress={handleLogin} style={styles.loginButton}>
        <Text style={styles.loginButtonText}>
          {!isLoading ? (
            "Login"
          ) : (
            <ActivityIndicator size="small" color="#ffff" />
          )}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: "15%",
    backgroundColor: "#fff",
  },
  logo: {
    textAlign: "center",
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    color: "#006400",
  },
  loginText: {
    fontSize: 24,
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingHorizontal: 16,
    marginBottom: 10,
    borderRadius: 5,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#006400",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    marginRight: 8,
  },
  label: {
    fontSize: 16,
  },
  loginButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#006400",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
  },
  errorText: {
    color: "red",
    padding: 5,
  },
});
