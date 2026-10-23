import { useRouter } from "expo-router";
import { ThemedTextButton } from "./ThemedTextButton";

type Props = {
  accessibilityLabel: string;
};

export const CloseModalButton = ({ accessibilityLabel }: Props) => {
  const router = useRouter();

  const close = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };

  return (
    <ThemedTextButton
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={close}
    >
      Luk
    </ThemedTextButton>
  );
};
