import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import "react-native-reanimated";
import Header from "@/components/header";

import { useColorScheme } from "@/hooks/useColorScheme";
import { createContext } from "react";

export const UserContext = createContext({
  trackingData: {},
  user: {},
  setUser: (value: any) => {},
  setTrackingData: (value: any) => {},
});
const Provider = ({ children }: any) => {
  const [user, setUser] = useState({});
  const [trackingData, setTrackingData] = useState({});
  return (
    <UserContext.Provider value={{ user, setUser, trackingData, setTrackingData }}>
      {children}
    </UserContext.Provider>
  );
};
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const path = usePathname();
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen
            name="(tabs)"
            options={{ headerShown: path !== "/", header: Header }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
