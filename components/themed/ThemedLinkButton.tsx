import { Link, LinkProps } from "expo-router";
import { useColors } from "../colors/useColors";
import { ThemedText } from "./ThemedText";

type Props = Omit<LinkProps, "children"> & {
  children: string;
};

export function ThemedLinkButton({
  children,
  href,
  style,
  ...otherProps
}: Props) {
  const colors = useColors();

  return (
    <Link
      style={[
        {
          alignSelf: "center",
          borderColor: colors.text,
          borderRadius: 8,
          borderWidth: 2,
          elevation: 4,
          paddingHorizontal: 16,
          paddingVertical: 4,
        },
        // @ts-ignore
        style,
      ]}
      href={href}
      {...otherProps}
    >
      <ThemedText>{children}</ThemedText>
    </Link>
  );
}
