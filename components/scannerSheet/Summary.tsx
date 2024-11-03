import { View } from "react-native";
import { Battery } from "../Battery";
import { FlameIcon } from "../iconsRow/FlameIcon";
import { FlameOutlineIcon } from "../iconsRow/FlameOutlineIcon";
import { HeartIcon } from "../iconsRow/HeartIcon";
import { HeartOutlineIcon } from "../iconsRow/HeartOutlineIcon";
import { IconsRow } from "../iconsRow/IconsRow";

export const Summary = ({
  flames,
  hearts,
  percentage,
}: {
  flames: number;
  hearts: number;
  percentage: number;
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
    }}
  >
    <View
      style={{
        alignItems: "center",
      }}
    >
      <View
        style={{
          alignContent: "center",
          marginLeft: 20,
          width: 80,
        }}
      >
        <Battery percentage={percentage} />
      </View>
      <View
        style={{
          height: 5,
        }}
      />
      <IconsRow
        currentValue={flames}
        excludedIcon={<FlameOutlineIcon />}
        gap={1}
        includedIcon={<FlameIcon />}
        maximum={10}
        size={12}
      />
      <View
        style={{
          height: 5,
        }}
      />
      <IconsRow
        currentValue={hearts}
        excludedIcon={<HeartOutlineIcon />}
        gap={1}
        includedIcon={<HeartIcon />}
        maximum={10}
        size={12}
      />
    </View>
  </View>
);
