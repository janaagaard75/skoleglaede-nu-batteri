import { Link, LinkProps } from "expo-router";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = LinkProps & {
  children: string;
};

export const ThemedLinkButton = ({
  children,
  href,
  style,
  ...otherProps
}: Props) => {
  const colors = useColors();

  return (
    <Link
      href={href}
      style={[
        {
          alignSelf: "center",
          borderColor: colors.text,
          borderRadius: 8,
          borderWidth: 2,
          paddingHorizontal: 16,
          paddingVertical: 4,
        },
        style,
      ]}
      {...otherProps}
    >
      <ThemedText>{children}</ThemedText>
    </Link>
  );
};
