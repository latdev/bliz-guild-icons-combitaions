const fs = require("node:fs");
const https = require("node:https");

const emblems = []

const colors = [
	"101517", // chornij
	"672300", // oranzevij
	"674500", // oranzevij2
	"dfa55a", // zholtij
	"376700", // zelonij
	"004867", // sinij
	"092a5d", // sinij tjomnij


	"b1b8b1", // belij
	"675600", // serij
]


const bgcolors = [
	"b1002e", // krasinj
	"e14500", // oranzevij
	"4f2300", // oranzevij2 (коричнево оранжевый)
	"8e9700", // zeljonij
	"4d8eda", // goluboj
	"006391", // drugoj goluboj
	"003582", // sinij
	"bd005b", // esho odin rozovij
	"9e0036", // rozovij
	"ff38fa", // rozovij - Kislota
	"860f9a", // пурпурный
	"232323", // serij
	"646464", // svetlo serij
	"ffffff", // chisto belij
]


const url = (emblem, bgcolor, icocolor) => `https://render.worldofwarcraft.com/us/guild/crest/${emblem}/emblem-${emblem}-${icocolor}-${bgcolor}.jpg`;


async function main() {
	for (let i=0; i<194; i++) { // fixme: possible max icon combination count?
		for (let bg of bgcolors) {
			for (let cl of colors) {
				const addr = url(i, bg, cl);
				const file = `emblem-${i}-${bg}-${cl}.jpg`;

				if (!fs.existsSync(file)) {
					console.log(`${addr} => ${file}`);
					await download(addr, `./wow-guild-emblems-all/${file}`);
				}
			}
		}
	}
}


async function download(url, filePath) {
  const proto = !url.charAt(4).localeCompare('s') ? https : http;

  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filePath);
    let fileInfo = null;

    const request = proto.get(url, response => {
      if (response.statusCode !== 200) {
        fs.unlink(filePath, () => {
          reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        });
        return;
      }

      fileInfo = {
        mime: response.headers['content-type'],
        size: parseInt(response.headers['content-length'], 10),
      };

      response.pipe(file);
    });

    // The destination stream is ended by the time it's called
    file.on('finish', () => resolve(fileInfo));

    request.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    file.on('error', err => {
      fs.unlink(filePath, () => reject(err));
    });

    request.end();
  });
}

main().catch(console.error);