import { ReactNode } from "react";
import { View } from "react-native";

interface Props {
  currentValue: number;
  excludedIcon: ReactNode;
  includedIcon: ReactNode;
  maximum: number;
}

export const IconsRow = (props: Props) => (
  <View
    style={{
      alignSelf: "center",
      display: "flex",
      flexDirection: "row",
      gap: 3,
    }}
  >
    {(() =>
      Array.from({ length: props.maximum }).map((_, index) => (
        <View
          key={index}
          style={{
            height: 30,
            width: 30,
          }}
        >
          {(() => {
            if (index < props.currentValue) {
              return props.includedIcon;
            } else {
              return props.excludedIcon;
            }
          })()}
        </View>
      )))()}
  </View>
);
