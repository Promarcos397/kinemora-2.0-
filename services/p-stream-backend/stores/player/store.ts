import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

import { createCastingSlice } from "./slices/casting";
import { createDisplaySlice } from "./slices/display";
import { createInterfaceSlice } from "./slices/interface";
import { createPlayingSlice } from "./slices/playing";
import { createProgressSlice } from "./slices/progress";
import { createSourceSlice } from "./slices/source";
import { createThumbnailSlice } from "./slices/thumbnails";
import { AllSlices } from "./slices/types";

export const usePlayerStore = create(
  immer<AllSlices>((...a) => ({
    ...createInterfaceSlice(...a),
    ...createProgressSlice(...a),
    ...createPlayingSlice(...a),
    ...createSourceSlice(...a),
    ...createDisplaySlice(...a),
    ...createCastingSlice(...a),
    ...createThumbnailSlice(...a),
  })),
);
