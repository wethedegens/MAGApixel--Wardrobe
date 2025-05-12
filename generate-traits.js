const fs = require("fs");
const path = require("path");

const traitTypes = ["background", "skin", "face", "body", "head", "glasses", "hand"];
const baseDir = path.join(__dirname, "traits");
const output = {};

traitTypes.forEach(trait => {
  const traitDir = path.join(baseDir, trait);
  try {
    const files = fs.readdirSync(traitDir).filter(file =>
      /\.(png|gif)$/i.test(file)
    );
    output[trait] = files;
  } catch (err) {
    console.error(`❌ Could not read folder: traits/${trait}`, err);
    output[trait] = [];
  }
});

fs.writeFileSync("traits.json", JSON.stringify(output, null, 2));
console.log("✅ traits.json created!");
