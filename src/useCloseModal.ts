import { useRouter } from "expo-router";

export const useCloseModal = () => {
  const router = useRouter();

  return () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/");
    }
  };
};
