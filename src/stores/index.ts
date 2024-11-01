import { createContext, useContext } from "react";
import RootStore from './RootStore.ts';

const rootStore = new RootStore();
export const StoreContext = createContext(rootStore);
export const useStore = () => useContext(StoreContext);

export default rootStore;
