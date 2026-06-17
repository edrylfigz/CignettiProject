const fs = require("fs");
const JSZip = require("jszip");

async function extractFPY() {
  const file = fs.readFileSync("dashboard.pptx");
  const zip = await JSZip.loadAsync(file);

  const slides = {};
  const files = Object.keys(zip.files);

  for (let f of files) {
    if (f.includes("ppt/slides/slide")) {
      const content = await zip.files[f].async("string");

      // extract % values like 97%, 72%, etc
      const match = content.match(/(\d{2,3})%/);

      if (match) {
        slides[f] = parseInt(match[1]);
      }
    }
  }

  // map to your stations manually
  const data = {
    stations: [
      { name: "S4 Design FDC", fpy: slides["ppt/slides/slide3.xml"] || 0, slides: [3, 4] },
      { name: "S10 SCV", fpy: slides["ppt/slides/slide5.xml"] || 0, slides: [5, 6] },
      { name: "M1 Install", fpy: slides["ppt/slides/slide7.xml"] || 0, slides: [7, 8] },
      { name: "S14 Final Inspection", fpy: slides["ppt/slides/slide9.xml"] || 0, slides: [9, 10] },
      { name: "M2 Activation", fpy: slides["ppt/slides/slide11.xml"] || 0, slides: [11, 12] }
    ]
  };

  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

extractFPY();