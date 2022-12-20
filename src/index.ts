import Axios from "axios";
import { createWriteStream, promises as fs } from "fs";
import Path from "path";

const registeredCommit = [
  "8c8f9b4b651530894a35fba0999e08b8822f318e",
  "f3b841f4f870a84ce2318a739561c88b1ea9d0ab",
  "1381377e917f5248e5fa8a1426fe5449783094d3",
];

const getYarnLock = async () => {
  fs.mkdir("registry");
  registeredCommit.map(async (commitSHA) => {
    // await fs.
    const writer = createWriteStream(`registry/${commitSHA}.yarn.lock`);
    const writer2 = createWriteStream(`registry/${commitSHA}.package.json`);

    const url = `https://raw.githubusercontent.com/DIYgod/RSSHub/${commitSHA}/yarn.lock`;
    const url2 = `https://raw.githubusercontent.com/DIYgod/RSSHub/${commitSHA}/package.json`;

    const response = await Axios({
      url,
      method: "GET",
      responseType: "stream",
    });

    const response2 = await Axios({
      url: url2,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);
    response2.data.pipe(writer2);

    await new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });

    await new Promise((resolve, reject) => {
      writer2.on("finish", resolve);
      writer2.on("error", reject);
    });
  });
};

getYarnLock();
