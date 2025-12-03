// 0 = empty (gray/black), 1 = yellow
// Pattern is a 3x3 grid flattened: [TL, TM, TR, ML, MM, MR, BL, BM, BR]
// But actually, for OLL, we care about the top face stickers.
// Let's represent the top face as a 3x3 array of 0/1.
// 1 means the sticker is Yellow. 0 means it's not.
// We also need to represent the side stickers (bar/headlights) for full recognition, 
// but for a simple schema, just the top pattern is often enough if we assume standard orientation.
// However, to be precise, let's just do the top face 3x3 grid for now as requested "vue de haut".

export const ollAlgorithms = [
  {
    id: 1,
    name: "Dot",
    group: "Dot",
    pattern: [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0]
    ],
    algorithms: [
      "R U2 R2 F R F' U2 R' F R F'"
    ]
  },
  {
    id: 2,
    name: "Square",
    group: "L",
    pattern: [
      [0, 0, 0],
      [0, 1, 1],
      [0, 1, 1]
    ],
    algorithms: [
      "F R U R' U' F' f R U R' U' f'"
    ]
  },
  {
    id: 21,
    name: "Lightning",
    group: "CrLoss",
    pattern: [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 0]
    ],
    algorithms: [
      "R U2 R' U' R U R' U' R U' R'"
    ]
  },
  {
    id: 22,
    name: "Fish",
    group: "L",
    pattern: [
      [0, 0, 1],
      [1, 1, 0],
      [0, 1, 0]
    ],
    algorithms: [
      "R U2 R2 U' R2 U' R2 U2 R"
    ]
  },
  {
    id: 23,
    name: "Knight",
    group: "Line",
    pattern: [
      [0, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    algorithms: [
      "R2 D R' U2 R D' R' U2 R'"
    ]
  },
  {
    id: 24,
    name: "Cross",
    group: "Cross",
    pattern: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0]
    ],
    algorithms: [
      "r U R' U' r' F R F'"
    ]
  },
  {
    id: 25,
    name: "All corners oriented",
    group: "L",
    pattern: [
      [1, 1, 1],
      [1, 1, 0],
      [1, 0, 1]
    ],
    algorithms: [
      "F' r U R' U' r' F R"
    ]
  },
  {
    id: 26,
    name: "Awkard",
    group: "L",
    pattern: [
      [0, 1, 0],
      [1, 1, 0],
      [1, 0, 1]
    ],
    algorithms: [
      "R U2 R' U' R U' R'"
    ]
  },
  {
    id: 27,
    name: "P",
    group: "L",
    pattern: [
      [0, 1, 1],
      [0, 1, 1],
      [0, 0, 1]
    ],
    algorithms: [
      "R U R' U R U2 R'"
    ]
  },
  {
    id: 28,
    name: "T",
    group: "Line",
    pattern: [
      [1, 0, 0],
      [1, 1, 1],
      [1, 0, 0]
    ],
    algorithms: [
      "M' U M U2 M' U M"
    ]
  },
  {
    id: 29,
    name: "C",
    group: "Line",
    pattern: [
      [0, 1, 1],
      [0, 1, 0],
      [0, 1, 1]
    ],
    algorithms: [
      "M' U M U2 M' U M"
    ]
  },
  {
    id: 30,
    name: "W",
    group: "L",
    pattern: [
      [0, 1, 1],
      [1, 1, 0],
      [1, 0, 0]
    ],
    algorithms: [
      "M' U M U2 M' U M"
    ]
  },
  {
    id: 31,
    name: "L",
    group: "L",
    pattern: [
      [0, 1, 0],
      [1, 1, 0],
      [0, 0, 0]
    ],
    algorithms: [
      "M' U M U2 M' U M"
    ]
  },
  {
    id: 32,
    name: "Line",
    group: "Line",
    pattern: [
      [0, 0, 0],
      [1, 1, 1],
      [0, 0, 0]
    ],
    algorithms: [
      "M' U M U2 M' U M"
    ]
  }
];
