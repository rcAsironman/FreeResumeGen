import fullTime from "../../data/settings/full-time.json";
import c2c from "../../data/settings/c2c.json";
import type { ProfileSettings } from "@/types/resume";

export const starterProfiles: Record<"full-time" | "c2c", ProfileSettings> = {
  "full-time": fullTime as ProfileSettings,
  c2c: c2c as ProfileSettings,
};

