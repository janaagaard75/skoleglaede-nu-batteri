import { Link } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { type ComponentProps } from "react";
import { Platform } from "react-native";

/** Open the link using the in-app browser instead of the external browser app. The in-app browser will only be used if `href` is a string. */
export function InAppBrowserLink(props: ComponentProps<typeof Link>) {
  return (
    <Link
      target="_blank"
      {...props}
      onPress={async event => {
        if (Platform.OS === "web") {
          return;
        }

        if (typeof props.href !== "string") {
          return;
        }

        // Open the link in an in-app browser instead of the external system browser app.
        event.preventDefault();
        await openBrowserAsync(props.href);
      }}
    />
  );
}
