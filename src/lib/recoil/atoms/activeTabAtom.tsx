import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";

const { persistAtom } = recoilPersist();

export const activeTabAtom = atom<"create" | "list" | "analysis">({
  key: "activeTabAtom",
  default: "create",
  effects_UNSTABLE: [persistAtom],
});