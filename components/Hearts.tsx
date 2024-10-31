import { View } from "react-native";
import { HeartIcon } from "./HeartIcon";
import { HeartOutlineIcon } from "./HeartOutlineIcon";

interface Props {
  current: number;
  maximum: number;
}

export const Hearts = (props: Props) => (
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
            if (index < props.current) {
              return <HeartIcon />;
            } else {
              return <HeartOutlineIcon />;
            }
          })()}
        </View>
      )))()}
  </View>
);
