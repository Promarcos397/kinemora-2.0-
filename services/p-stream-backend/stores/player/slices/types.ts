import { StateCreator } from "zustand";

import { CastingSlice } from "./casting";
import { DisplaySlice } from "./display";
import { InterfaceSlice } from "./interface";
import { PlayingSlice } from "./playing";
import { ProgressSlice } from "./progress";
import { SourceSlice } from "./source";
import { ThumbnailSlice } from "./thumbnails";

export type AllSlices = InterfaceSlice &
  PlayingSlice &
  ProgressSlice &
  SourceSlice &
  DisplaySlice &
  CastingSlice &
  ThumbnailSlice;
export type MakeSlice<Slice> = StateCreator<
  AllSlices,
  [["zustand/immer", never]],
  [],
  Slice
>;
