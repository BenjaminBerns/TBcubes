const generateOLL = require('./generate_oll');

const rawData = `
## [OLL 1](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_1)
				R U2 R2 F R F' U2 R' F R F'				
## [OLL 2](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_2)
				y' R U' R2 D' r U r' D R2 U R'				
## [OLL 3](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_3)
				y R' F2 R2 U2 R' F R U2 R2 F2 R				
## [OLL 4](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_4)
				y' R' F2 R2 U2 R' F' R U2 R2 F2 R				
## [OLL 5](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_5)
				r' U2 R U R' U r				
## [OLL 6](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_6)
				r U2 R' U' R U' r'				
## [OLL 7](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_7)
				r U R' U R U2 r'				
## [OLL 8](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_8)
				y2 r' U' R U' R' U2 r				
## [OLL 9](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_9)
				y R U R' U' R' F R2 U R' U' F'				
## [OLL 10](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_10)
				R U R' U R' F R F' R U2 R'				
## [OLL 11](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_11)
				r' R2 U R' U R U2 R' U M'				
## [OLL 12](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_12)
				y' M' R' U' R U' R' U2 R U' M				
## [OLL 13](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_13)
				F U R U2 R' U' R U R' F'				
## [OLL 14](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_14)
				R' F R U R' F' R F U' F'				
## [OLL 15](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_15)
				r' U' r R' U' R U r' U r				
## [OLL 16](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_16)
				r U r' R U R' U' r U' r'				
## [OLL 17](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_17)
				R U R' U R' F R F' U2 R' F R F'				
## [OLL 18](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_18)
				y R U2 R2 F R F' U2 M' U R U' r'				
## [OLL 19](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_19)
				y S' R U R' S U' R' F R F'				
## [OLL 20](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_20)
				r U R' U' M2 U R U' R' U' M'				
## [OLL 21](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_21)
				R U R' U R U' R' U R U2 R'				
## [OLL 22](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_22)
				R U2 R2 U' R2 U' R2 U2 R				
## [OLL 23](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_23)
				R2 D R' U2 R D' R' U2 R'				
## [OLL 24](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_24)
				r U R' U' r' F R F'				
## [OLL 25](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_25)
				R U2 R D R' U2 R D' R2				
## [OLL 26](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_26)
				y R U2 R' U' R U' R'				
## [OLL 27](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_27)
				R U R' U R U2 R'				
## [OLL 28](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_28)
				r U R' U' M U R U' R'				
## [OLL 29](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_29)
				r2 D' r U r' D r2 U' r' U' r				
## [OLL 30](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_30)
				y' r' D' r U' r' D r2 U' r' U r U r'				
## [OLL 31](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_31)
				R' U' F U R U' R' F' R				
## [OLL 32](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_32)
				S R U R' U' R' F R f'				
## [OLL 33](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_33)
				R U R' U' R' F R F'				
## [OLL 34](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_34)
				y f R f' U' r' U' R U M'				
## [OLL 35](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_35)
				R U2 R2 F R F' R U2 R'				
## [OLL 36](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_36)
				y R U R2 F' U' F U R2 U2 R'				
## [OLL 37](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_37)
				F R' F' R U R U' R'				
## [OLL 38](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_38)
				R U R' U R U' R' U' R' F R F'				
## [OLL 39](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_39)
				y' R U R' F' U' F U R U2 R'				
## [OLL 40](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_40)
				y R' F R U R' U' F' U R				
## [OLL 41](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_41)
				y2 R U R' U R U2 R' F R U R' U' F'				
## [OLL 42](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_42)
				R' U' R U' R' U2 R F R U R' U' F'				
## [OLL 43](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_43)
				y R' U' F' U F R				
## [OLL 44](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_44)
				f R U R' U' f'				
## [OLL 45](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_45)
				F R U R' U' F'				
## [OLL 46](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_46)
				R' U' R' F R F' U R				
## [OLL 47](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_47)
				y' F R' F' R U2 R U' R' U R U2 R'				
## [OLL 48](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_48)
				F R U R' U' R U R' U' F'				
## [OLL 49](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_49)
				y2 r U' r2 U r2 U r2 U' r				
## [OLL 50](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_50)
				r' U r2 U' r2 U' r2 U r'				
## [OLL 51](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_51)
				y2 F U R U' R' U R U' R' F'				
## [OLL 52](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_52)
				y2 R' F' U' F U' R U R' U R				
## [OLL 53](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_53)
				r' U' R U' R' U R U' R' U2 r				
## [OLL 54](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_54)
				r U R' U R U' R' U R U2 r'				
## [OLL 55](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_55)
				y R' F U R U' R2 F' R2 U R' U' R				
## [OLL 56](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_56)
				r U r' U R U' R' U R U' R' r U' r'				
## [OLL 57](https://speedcubedb.com/a/3x3/a/3x3/OLL/OLL_57)
				R U R' U' M' U R U' r'				
`;

const ollData = [];
const lines = rawData.split('\n');
let currentId = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (line.startsWith('## [OLL')) {
    const match = line.match(/OLL (\d+)/);
    if (match) {
      currentId = parseInt(match[1]);
    }
  } else if (currentId && line.length > 0) {
    // This is the algorithm
    ollData.push({
      id: currentId,
      alg: line
    });
    currentId = null; // Reset to avoid capturing multiple algs if format is weird
  }
}

console.log(`Parsed ${ollData.length} algorithms.`);
generateOLL(ollData);
