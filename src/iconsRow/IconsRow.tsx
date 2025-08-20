import { ReactNode } from "react";
import { View } from "react-native";

interface Props {
  currentValue: number;
  excludedIcon: ReactNode;
  gap: number;
  includedIcon: ReactNode;
  maximum: number;
  size: number;
}

export const IconsRow = (props: Props) => (
  <View
    style={{
      alignSelf: "center",
      display: "flex",
      flexDirection: "row",
      gap: props.gap,
    }}
  >
    {(() =>
      Array.from({ length: props.maximum }).map((_, index) => (
        <View
          key={index}
          style={{
            height: props.size,
            width: props.size,
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
