import { useContext } from "react";
import { MainStateContext } from "./MainStateProvider";

export const useMainState = () => useContext(MainStateContext);
