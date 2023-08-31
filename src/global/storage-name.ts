import { version } from "../../package.json";

export const getStorageTextToSave = (stateName: string) =>
  `@vite-timer:${stateName}-state-${version}`;
