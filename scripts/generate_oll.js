
const fs = require('fs');
const path = require('path');

// --- Cube Simulator ---

class Cube {
  constructor() {
    this.reset();
  }

  reset() {
    // Faces: U, D, F, B, L, R
    // 0: Non-Yellow, 1: Yellow (Target for OLL)
    // Initialize Solved state (U is Yellow)
    this.state = {
      U: [1, 1, 1, 1, 1, 1, 1, 1, 1],
      D: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      F: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      B: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      L: [0, 0, 0, 0, 0, 0, 0, 0, 0],
      R: [0, 0, 0, 0, 0, 0, 0, 0, 0]
    };
  }

  // Helper to rotate a face array clockwise
  rotateFace(face) {
    const newFace = [...face];
    // 0 1 2    6 3 0
    // 3 4 5 -> 7 4 1
    // 6 7 8    8 5 2
    newFace[0] = face[6]; newFace[1] = face[3]; newFace[2] = face[0];
    newFace[3] = face[7]; newFace[4] = face[4]; newFace[5] = face[1];
    newFace[6] = face[8]; newFace[7] = face[5]; newFace[8] = face[2];
    return newFace;
  }

  rotateFaceCCW(face) {
    const newFace = [...face];
    // 0 1 2    2 5 8
    // 3 4 5 -> 1 4 7
    // 6 7 8    0 3 6
    newFace[0] = face[2]; newFace[1] = face[5]; newFace[2] = face[8];
    newFace[3] = face[1]; newFace[4] = face[4]; newFace[5] = face[7];
    newFace[6] = face[0]; newFace[7] = face[3]; newFace[8] = face[6];
    return newFace;
  }

  rotateFaceDouble(face) {
    return this.rotateFace(this.rotateFace(face));
  }

  // Basic Moves
  U() {
    this.state.U = this.rotateFace(this.state.U);
    const temp = [...this.state.F.slice(0, 3)];
    // F -> L -> B -> R -> F
    this.state.F[0] = this.state.R[0]; this.state.F[1] = this.state.R[1]; this.state.F[2] = this.state.R[2];
    this.state.R[0] = this.state.B[0]; this.state.R[1] = this.state.B[1]; this.state.R[2] = this.state.B[2];
    this.state.B[0] = this.state.L[0]; this.state.B[1] = this.state.L[1]; this.state.B[2] = this.state.L[2];
    this.state.L[0] = temp[0]; this.state.L[1] = temp[1]; this.state.L[2] = temp[2];
  }

  D() {
    this.state.D = this.rotateFace(this.state.D);
    const temp = [...this.state.F.slice(6, 9)];
    // F -> R -> B -> L -> F
    this.state.F[6] = this.state.L[6]; this.state.F[7] = this.state.L[7]; this.state.F[8] = this.state.L[8];
    this.state.L[6] = this.state.B[6]; this.state.L[7] = this.state.B[7]; this.state.L[8] = this.state.B[8];
    this.state.B[6] = this.state.R[6]; this.state.B[7] = this.state.R[7]; this.state.B[8] = this.state.R[8];
    this.state.R[6] = temp[0]; this.state.R[7] = temp[1]; this.state.R[8] = temp[2];
  }

  F() {
    this.state.F = this.rotateFace(this.state.F);
    const temp = [this.state.U[6], this.state.U[7], this.state.U[8]];
    // U -> L -> D -> R -> U
    // U6,7,8 -> L8,5,2 -> D2,1,0 -> R0,3,6 -> U6,7,8
    this.state.U[6] = this.state.L[8]; this.state.U[7] = this.state.L[5]; this.state.U[8] = this.state.L[2];
    this.state.L[2] = this.state.D[0]; this.state.L[5] = this.state.D[1]; this.state.L[8] = this.state.D[2];
    this.state.D[0] = this.state.R[6]; this.state.D[1] = this.state.R[3]; this.state.D[2] = this.state.R[0];
    this.state.R[0] = temp[0]; this.state.R[3] = temp[1]; this.state.R[6] = temp[2];
  }

  B() {
    this.state.B = this.rotateFace(this.state.B);
    const temp = [this.state.U[0], this.state.U[1], this.state.U[2]];
    // U -> R -> D -> L -> U
    // U0,1,2 -> R2,5,8 -> D8,7,6 -> L6,3,0 -> U0,1,2
    this.state.U[0] = this.state.R[2]; this.state.U[1] = this.state.R[5]; this.state.U[2] = this.state.R[8];
    this.state.R[2] = this.state.D[8]; this.state.R[5] = this.state.D[7]; this.state.R[8] = this.state.D[6];
    this.state.D[6] = this.state.L[0]; this.state.D[7] = this.state.L[3]; this.state.D[8] = this.state.L[6];
    this.state.L[0] = temp[2]; this.state.L[3] = temp[1]; this.state.L[6] = temp[0];
  }

  L() {
    this.state.L = this.rotateFace(this.state.L);
    const temp = [this.state.U[0], this.state.U[3], this.state.U[6]];
    // U -> F -> D -> B -> U
    // U0,3,6 -> F0,3,6 -> D0,3,6 -> B8,5,2 -> U0,3,6
    this.state.U[0] = this.state.B[8]; this.state.U[3] = this.state.B[5]; this.state.U[6] = this.state.B[2];
    this.state.B[2] = this.state.D[6]; this.state.B[5] = this.state.D[3]; this.state.B[8] = this.state.D[0];
    this.state.D[0] = this.state.F[0]; this.state.D[3] = this.state.F[3]; this.state.D[6] = this.state.F[6];
    this.state.F[0] = temp[0]; this.state.F[3] = temp[1]; this.state.F[6] = temp[2];
  }

  R() {
    this.state.R = this.rotateFace(this.state.R);
    const temp = [this.state.U[2], this.state.U[5], this.state.U[8]];
    // U -> B -> D -> F -> U
    // U2,5,8 -> B6,3,0 -> D2,5,8 -> F2,5,8 -> U2,5,8
    this.state.U[2] = this.state.F[2]; this.state.U[5] = this.state.F[5]; this.state.U[8] = this.state.F[8];
    this.state.F[2] = this.state.D[2]; this.state.F[5] = this.state.D[5]; this.state.F[8] = this.state.D[8];
    this.state.D[2] = this.state.B[6]; this.state.D[5] = this.state.B[3]; this.state.D[8] = this.state.B[0];
    this.state.B[0] = temp[2]; this.state.B[3] = temp[1]; this.state.B[6] = temp[0];
  }

  // Slice Moves
  M() {
    // M follows L
    // L R' x'
    // Or just move middle layer
    // U1,4,7 -> F1,4,7 -> D1,4,7 -> B7,4,1 -> U1,4,7
    const temp = [this.state.U[1], this.state.U[4], this.state.U[7]];
    this.state.U[1] = this.state.B[7]; this.state.U[4] = this.state.B[4]; this.state.U[7] = this.state.B[1];
    this.state.B[1] = this.state.D[7]; this.state.B[4] = this.state.D[4]; this.state.B[7] = this.state.D[1];
    this.state.D[1] = this.state.F[1]; this.state.D[4] = this.state.F[4]; this.state.D[7] = this.state.F[7];
    this.state.F[1] = temp[0]; this.state.F[4] = temp[1]; this.state.F[7] = temp[2];
  }

  E() {
    // E follows D
    // U D' y'
    // F3,4,5 -> R3,4,5 -> B3,4,5 -> L3,4,5 -> F3,4,5
    const temp = [this.state.F[3], this.state.F[4], this.state.F[5]];
    this.state.F[3] = this.state.L[3]; this.state.F[4] = this.state.L[4]; this.state.F[5] = this.state.L[5];
    this.state.L[3] = this.state.B[3]; this.state.L[4] = this.state.B[4]; this.state.L[5] = this.state.B[5];
    this.state.B[3] = this.state.R[3]; this.state.B[4] = this.state.R[4]; this.state.B[5] = this.state.R[5];
    this.state.R[3] = temp[0]; this.state.R[4] = temp[1]; this.state.R[5] = temp[2];
  }

  S() {
    // S follows F
    // F B' z
    // U3,4,5 -> R1,4,7 -> D5,4,3 -> L7,4,1 -> U3,4,5
    const temp = [this.state.U[3], this.state.U[4], this.state.U[5]];
    this.state.U[3] = this.state.L[7]; this.state.U[4] = this.state.L[4]; this.state.U[5] = this.state.L[1];
    this.state.L[1] = this.state.D[3]; this.state.L[4] = this.state.D[4]; this.state.L[7] = this.state.D[5];
    this.state.D[3] = this.state.R[7]; this.state.D[4] = this.state.R[4]; this.state.D[5] = this.state.R[1];
    this.state.R[1] = temp[0]; this.state.R[4] = temp[1]; this.state.R[7] = temp[2];
  }

  // Rotations
  x() {
    // Follows R
    this.R();
    this.M(); this.M(); this.M(); // M' = M M M
    this.L(); this.L(); this.L(); // L' = L L L
  }

  y() {
    // Follows U
    this.U();
    this.E(); this.E(); this.E(); // E'
    this.D(); this.D(); this.D(); // D'
  }

  z() {
    // Follows F
    this.F();
    this.S();
    this.B(); this.B(); this.B(); // B'
  }

  // Wide moves
  r() { this.L(); this.x(); } // r = L x ? No. r = R M'.
  // Actually, easiest is: r = R + M'
  // M' = M M M
  // So r = R + M M M
  
  // Let's implement wide moves as combinations
  // r = R M'
  // l = L M
  // u = U E'
  // d = D E
  // f = F S
  // b = B S'
}

// Helper to execute a move string
function applyMove(cube, move) {
  switch(move) {
    case 'R': cube.R(); break;
    case "R'": cube.R(); cube.R(); cube.R(); break;
    case 'R2': cube.R(); cube.R(); break;
    case 'L': cube.L(); break;
    case "L'": cube.L(); cube.L(); cube.L(); break;
    case 'L2': cube.L(); cube.L(); break;
    case 'U': cube.U(); break;
    case "U'": cube.U(); cube.U(); cube.U(); break;
    case 'U2': cube.U(); cube.U(); break;
    case 'D': cube.D(); break;
    case "D'": cube.D(); cube.D(); cube.D(); break;
    case 'D2': cube.D(); cube.D(); break;
    case 'F': cube.F(); break;
    case "F'": cube.F(); cube.F(); cube.F(); break;
    case 'F2': cube.F(); cube.F(); break;
    case 'B': cube.B(); break;
    case "B'": cube.B(); cube.B(); cube.B(); break;
    case 'B2': cube.B(); cube.B(); break;
    
    case 'M': cube.M(); break;
    case "M'": cube.M(); cube.M(); cube.M(); break;
    case 'M2': cube.M(); cube.M(); break;
    case 'E': cube.E(); break;
    case "E'": cube.E(); cube.E(); cube.E(); break;
    case 'E2': cube.E(); cube.E(); break;
    case 'S': cube.S(); break;
    case "S'": cube.S(); cube.S(); cube.S(); break;
    case 'S2': cube.S(); cube.S(); break;

    case 'x': cube.x(); break;
    case "x'": cube.x(); cube.x(); cube.x(); break;
    case 'x2': cube.x(); cube.x(); break;
    case 'y': cube.y(); break;
    case "y'": cube.y(); cube.y(); cube.y(); break;
    case 'y2': cube.y(); cube.y(); break;
    case 'z': cube.z(); break;
    case "z'": cube.z(); cube.z(); cube.z(); break;
    case 'z2': cube.z(); cube.z(); break;

    // Wide moves
    case 'r': cube.R(); cube.M(); cube.M(); cube.M(); break; // R M'
    case "r'": cube.R(); cube.R(); cube.R(); cube.M(); break; // R' M
    case 'r2': cube.R(); cube.R(); cube.M(); cube.M(); break; // R2 M2
    
    case 'l': cube.L(); cube.M(); break; // L M
    case "l'": cube.L(); cube.L(); cube.L(); cube.M(); cube.M(); cube.M(); break; // L' M'
    case 'l2': cube.L(); cube.L(); cube.M(); cube.M(); break;

    case 'u': cube.U(); cube.E(); cube.E(); cube.E(); break; // U E'
    case "u'": cube.U(); cube.U(); cube.U(); cube.E(); break; // U' E
    case 'u2': cube.U(); cube.U(); cube.E(); cube.E(); break;

    case 'd': cube.D(); cube.E(); break; // D E
    case "d'": cube.D(); cube.D(); cube.D(); cube.E(); cube.E(); cube.E(); break; // D' E'
    case 'd2': cube.D(); cube.D(); cube.E(); cube.E(); break;

    case 'f': cube.F(); cube.S(); break; // F S
    case "f'": cube.F(); cube.F(); cube.F(); cube.S(); cube.S(); cube.S(); break; // F' S'
    case 'f2': cube.F(); cube.F(); cube.S(); cube.S(); break;

    case 'b': cube.B(); cube.S(); cube.S(); cube.S(); break; // B S'
    case "b'": cube.B(); cube.B(); cube.B(); cube.S(); break; // B' S
    case 'b2': cube.B(); cube.B(); cube.S(); cube.S(); break;
  }
}

// Invert algorithm
function invertAlg(alg) {
  const moves = alg.trim().split(/\s+/);
  const inverted = [];
  for (let i = moves.length - 1; i >= 0; i--) {
    let move = moves[i];
    if (move.endsWith('2') || move.endsWith("2'")) {
      inverted.push(move.replace("'", "")); // R2' -> R2
    } else if (move.endsWith("'")) {
      inverted.push(move.slice(0, -1)); // R' -> R
    } else {
      inverted.push(move + "'"); // R -> R'
    }
  }
  return inverted;
}

// Data
const ollData = [
  { id: 1, alg: "R U2 R2 F R F' U2 R' F R F'" },
  { id: 2, alg: "y' R U' R2 D' r U r' D R2 U R'" },
  { id: 3, alg: "y R' F2 R2 U2 R' F R U2 R2 F2 R" },
  { id: 4, alg: "y' R' F2 R2 U2 R' F' R U2 R2 F2 R" },
  { id: 5, alg: "r' U2 R U R' U r" },
  { id: 6, alg: "r U2 R' U' R U' r'" },
  { id: 7, alg: "r U R' U R U2 r'" },
  { id: 8, alg: "y2 r' U' R U' R' U2 r" },
  { id: 9, alg: "y R U R' U' R' F R2 U R' U' F'" },
  { id: 10, alg: "R U R' U R' F R F' R U2 R'" },
  { id: 11, alg: "r' R2 U R' U R U2 R' U M'" },
  { id: 12, alg: "y' M' R' U' R U' R' U2 R U' M" },
  { id: 13, alg: "F U R U2 R' U' R U R' F'" },
  { id: 14, alg: "R' F R U R' F' R F U' F'" },
  { id: 15, alg: "r' U' r R' U' R U r' U r" },
  { id: 16, alg: "r U r' R U R' U' r U' r'" },
  { id: 17, alg: "R U R' U R' F R F' U2 R' F R F'" },
  { id: 18, alg: "y R U2 R2 F R F' U2 M' U R U' r'" },
  { id: 19, alg: "y S' R U R' S U' R' F R F'" },
  { id: 20, alg: "r U R' U' M2 U R U' R' U' M'" },
  { id: 21, alg: "R U R' U R U' R' U R U2 R'" },
  { id: 22, alg: "R U2 R2 U' R2 U' R2 U2 R" },
  { id: 23, alg: "R2 D R' U2 R D' R' U2 R'" },
  { id: 24, alg: "r U R' U' r' F R F'" },
  { id: 25, alg: "R U2 R D R' U2 R D' R2" },
  { id: 26, alg: "y R U2 R' U' R U' R'" },
  { id: 27, alg: "R U R' U R U2 R'" },
  { id: 28, alg: "r U R' U' M U R U' R'" },
  { id: 29, alg: "r2 D' r U r' D r2 U' r' U' r" },
  { id: 30, alg: "y' r' D' r U' r' D r2 U' r' U r U r'" },
  { id: 31, alg: "R' U' F U R U' R' F' R" },
  { id: 32, alg: "S R U R' U' R' F R f'" },
  { id: 33, alg: "R U R' U' R' F R F'" },
  { id: 34, alg: "y f R f' U' r' U' R U M'" },
  { id: 35, alg: "R U2 R2 F R F' R U2 R'" },
  { id: 36, alg: "y R U R2 F' U' F U R2 U2 R'" },
  { id: 37, alg: "F R' F' R U R U' R'" },
  { id: 38, alg: "R U R' U R U' R' U' R' F R F'" },
  { id: 39, alg: "y' R U R' F' U' F U R U2 R'" },
  { id: 40, alg: "y R' F R U R' U' F' U R" },
  { id: 41, alg: "y2 R U R' U R U2 R' F R U R' U' F'" },
  { id: 42, alg: "R' U' R U' R' U2 R F R U R' U' F'" },
  { id: 43, alg: "y R' U' F' U F R" },
  { id: 44, alg: "f R U R' U' f'" },
  { id: 45, alg: "F R U R' U' F'" },
  { id: 46, alg: "R' U' R' F R F' U R" },
  { id: 47, alg: "y' F R' F' R U2 R U' R' U R U2 R'" },
  { id: 48, alg: "F R U R' U' R U R' U' F'" },
  { id: 49, alg: "y2 r U' r2 U r2 U r2 U' r" },
  { id: 50, alg: "r' U r2 U' r2 U' r2 U r'" },
  { id: 51, alg: "y2 F U R U' R' U R U' R' F'" },
  { id: 52, alg: "y2 R' F' U' F U' R U R' U R" },
  { id: 53, alg: "r' U' R U' R' U R U' R' U2 r" },
  { id: 54, alg: "r U R' U R U' R' U R U2 r'" },
  { id: 55, alg: "y R' F U R U' R2 F' R2 U R' U' R" },
  { id: 56, alg: "r U r' U R U' R' U R U' R' r U' r'" },
  { id: 57, alg: "R U R' U' M' U R U' r'" }
];


// ... (Cube class and helpers remain the same, I will keep them but wrap the execution)

// Export the generator function
module.exports = function generateOLLFile(ollData) {
  const results = [];

  for (const item of ollData) {
    const cube = new Cube();
    // Invert algorithm to get the case
    const invertedMoves = invertAlg(item.alg);
    
    for (const move of invertedMoves) {
      applyMove(cube, move);
    }
    
    // Read U face
    // Convert to 3x3 array
    const uFace = cube.state.U;
    const pattern = [
      [uFace[0], uFace[1], uFace[2]],
      [uFace[3], uFace[4], uFace[5]],
      [uFace[6], uFace[7], uFace[8]]
    ];
    
    results.push({
      id: item.id,
      name: `OLL ${item.id}`,
      algorithms: [item.alg],
      pattern: pattern
    });
  }

  // Write to file
  const output = `export const ollAlgorithms = ${JSON.stringify(results, null, 2)};`;
  fs.writeFileSync(path.join(__dirname, '../src/data/oll.js'), output);

  console.log('Generated oll.js with ' + results.length + ' algorithms.');
}
