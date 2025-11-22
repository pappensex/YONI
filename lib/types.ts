export type ModuleKey = "CORE" | "FLOW" | "MONEY" | "SPACE" | "ENERGY";

export interface ModuleCard {
  key: ModuleKey;
  title: string;
  description: string;
  highlight?: string;
}
