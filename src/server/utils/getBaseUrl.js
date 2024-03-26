import http from "http";
import https from "https";
import { writeFileSync, readFileSync } from "fs";
import { CONTENT_URLS } from "../config.js";

let BASE_URL;

async function checkUrl(url) {
  const list = await JSON.parse(
    readFileSync(`${CONTENT_URLS}/urls.json`, "utf8")
  );
  return new Promise((resolve, reject) => {
    if (
      url.includes("rtsp:") ||
      url.includes("mmsh:") ||
      url.includes("uhttp:")
    ) {
      resolve({ status: false, url: "" });
    }
    const protocol = url.startsWith("https") ? https : http;

    protocol
      .get(url, (res) => {
        const { statusCode } = res;

        if (statusCode === 200) {
          resolve({ status: true, url });
        } else if (
          statusCode >= 300 &&
          statusCode < 400 &&
          res.headers.location
        ) {
          if (!list.find(({ url }) => url === res.headers.location)) {
            list.push({ url: res.headers.location });
            writeFileSync(
              `${CONTENT_URLS}/urls.json`,
              JSON.stringify(list, null, 2)
            );
          }

          checkUrl(res.headers.location).then(resolve);
        } else {
          setTimeout(() => {
            resolve({ status: false, url: "" });
          }, 1000 * 3);
        }
      })
      .on("error", (err) => {
        resolve({ status: false, url: "" });
      });
  });
}

export async function getBaseUrl() {
  const list = await JSON.parse(
    readFileSync(`${CONTENT_URLS}/urls.json`, "utf8")
  );

  if (BASE_URL) {
    return BASE_URL;
  }
  // const filteredPromises = list.map(async ({ url }) => {
  //   const result = await checkUrl(url);
  //   return result;
  // });

  // const filteredResults = await Promise.all(filteredPromises);

  // const workedUrl = filteredResults.find(({ status }) => status);

  // if (workedUrl?.url) {
  //   BASE_URL = workedUrl.url;
  // }
  BASE_URL = list[0].url;

  return BASE_URL;
}
