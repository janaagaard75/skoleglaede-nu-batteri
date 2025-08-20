import { useContext } from "react";
import { MainStateContext } from "./MainStateContext";

export const useMainState = () => useContext(MainStateContext);
