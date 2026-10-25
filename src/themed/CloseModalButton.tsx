import { useCloseModal } from "../useCloseModal";
import { ThemedTextButton } from "./ThemedTextButton";

type Props = {
  accessibilityLabel: string;
};

export const CloseModalButton = ({ accessibilityLabel }: Props) => {
  const closeModal = useCloseModal();

  return (
    <ThemedTextButton
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="button"
      hitSlop={8}
      onPress={closeModal}
    >
      Luk
    </ThemedTextButton>
  );
};
