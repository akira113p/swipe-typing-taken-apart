// Where each box and arrow of the pipeline diagram goes, placed by hand. Boxes are
// [x, y, width, height]; every arrow runs in straight segments and points at its last point.

export const WIDE = {
  size: [948, 650], fonts: [18, 13.5],
  nodes: {
    swipe: [226, 14, 365, 62], points: [226, 99, 365, 62], pruning: [226, 184, 365, 62],
    dictionary: [24, 162, 168, 106],
    shape: [120, 296, 175, 72], place: [311, 296, 175, 72], letters: [502, 296, 190, 72],
    settings: [698, 40, 226, 118], frequency: [698, 200, 226, 82], frequencies: [746, 312, 178, 94],
    vote: [226, 416, 459, 58], ranked: [226, 497, 459, 58], screen: [226, 578, 459, 58],
  },
  edges: [
    { path: [[408, 76], [408, 99]] }, { path: [[408, 161], [408, 184]] }, { path: [[192, 215], [226, 215]] },
    { path: [[408, 246], [408, 271], [207, 271], [207, 296]] }, { path: [[408, 246], [408, 296]] },
    { path: [[408, 246], [408, 271], [597, 271], [597, 296]] },
    { path: [[835, 312], [835, 282]] },
    { path: [[207, 368], [207, 392], [300, 392], [300, 416]], tone: "shape" },
    { path: [[398, 368], [398, 416]], tone: "place" },
    { path: [[597, 368], [597, 392], [500, 392], [500, 416]], tone: "letters" },
    { path: [[720, 282], [720, 392], [645, 392], [645, 416]], tone: "frequency" },
    { path: [[455, 474], [455, 497]] }, { path: [[455, 555], [455, 578]] },
  ],
};

// On a phone the four scores are stacked inside one dashed frame, so no order is implied between them.
export const NARROW = {
  size: [340, 1076], fonts: [15, 12],
  frame: [20, 306, 300, 368],
  nodes: {
    swipe: [20, 10, 300, 62], points: [20, 96, 300, 62], pruning: [152, 182, 168, 100],
    dictionary: [20, 182, 108, 100],
    shape: [32, 318, 276, 54], place: [32, 380, 276, 54], letters: [32, 442, 276, 54],
    frequency: [32, 504, 276, 54], frequencies: [60, 580, 220, 84],
    vote: [20, 698, 300, 76], ranked: [20, 802, 300, 62], screen: [20, 888, 300, 62],
    settings: [20, 974, 300, 92],
  },
  edges: [
    { path: [[170, 72], [170, 96]] }, { path: [[236, 158], [236, 182]] }, { path: [[128, 232], [152, 232]] },
    { path: [[236, 282], [236, 306]] }, { path: [[170, 580], [170, 558]] },
    { path: [[170, 674], [170, 698]] }, { path: [[170, 774], [170, 802]] }, { path: [[170, 864], [170, 888]] },
  ],
};
