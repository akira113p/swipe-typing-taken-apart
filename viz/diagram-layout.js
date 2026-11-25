// Where each box and arrow of the pipeline diagram goes, placed by hand. Boxes are
// [x, y, width, height]; every arrow runs in straight segments and points at its last point.

export const WIDE = {
  size: [970, 630], fonts: [18, 13.5], againAt: [940, 24],
  nodes: {
    swipe: [226, 58, 365, 62], points: [226, 143, 365, 62], pruning: [226, 228, 365, 62],
    dictionary: [24, 206, 168, 106],
    shape: [120, 340, 175, 72], place: [311, 340, 175, 72], letters: [502, 340, 190, 72],
    lambda: [698, 138, 226, 76], frequency: [698, 244, 226, 82], frequencies: [746, 356, 178, 94],
    vote: [226, 460, 459, 58], ranked: [226, 541, 459, 58],
  },
  edges: [
    { path: [[408, 120], [408, 143]] }, { path: [[408, 205], [408, 228]] }, { path: [[192, 259], [226, 259]] },
    { path: [[408, 290], [408, 315], [207, 315], [207, 340]] }, { path: [[408, 290], [408, 340]] },
    { path: [[408, 290], [408, 315], [597, 315], [597, 340]] },
    { path: [[811, 214], [811, 244]] }, { path: [[835, 356], [835, 326]] },
    { path: [[207, 412], [207, 436], [300, 436], [300, 460]], tone: "shape" },
    { path: [[398, 412], [398, 460]], tone: "place" },
    { path: [[597, 412], [597, 436], [500, 436], [500, 460]], tone: "letters" },
    { path: [[720, 326], [720, 436], [645, 436], [645, 460]], tone: "frequency" },
    { path: [[455, 518], [455, 541]] },
    { path: [[455, 599], [455, 618], [950, 618], [950, 34], [408, 34], [408, 58]] },
  ],
};

// On a phone the four scores are stacked inside one dashed frame, so no order is implied between them.
export const NARROW = {
  size: [360, 928], fonts: [15, 12], againAt: [340, 15],
  frame: [20, 340, 300, 368],
  nodes: {
    swipe: [20, 44, 300, 62], points: [20, 130, 300, 62], pruning: [152, 216, 168, 100],
    dictionary: [20, 216, 108, 100],
    shape: [32, 352, 276, 54], place: [32, 414, 276, 54], letters: [32, 476, 276, 54],
    frequency: [32, 538, 276, 54], lambda: [28, 614, 126, 84], frequencies: [170, 614, 142, 84],
    vote: [20, 732, 300, 76], ranked: [20, 836, 300, 62],
  },
  edges: [
    { path: [[170, 106], [170, 130]] }, { path: [[236, 192], [236, 216]] }, { path: [[128, 266], [152, 266]] },
    { path: [[236, 316], [236, 340]] }, { path: [[91, 614], [91, 592]] }, { path: [[241, 614], [241, 592]] },
    { path: [[170, 708], [170, 732]] }, { path: [[170, 808], [170, 836]] },
    { path: [[170, 898], [170, 915], [345, 915], [345, 22], [170, 22], [170, 44]] },
  ],
};
