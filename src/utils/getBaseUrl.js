import http from "http";
import https from "https";

let BASE_URL;

async function checkUrl(url) {
  return new Promise((resolve, reject) => {
    if (
      url.includes("rtsp:") ||
      url.includes("mmsh:") ||
      url.includes("uhttp:")
    ) {
      resolve(false);
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
          // Вы можете использовать новый URL здесь, если это необходимо
          // Для примера, передача его в функцию или обработка его
          // resolve({status: true, url: res.headers.location});
          // Или вы можете рекурсивно вызывать checkUrl с новым URL
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

export async function getBaseUrl(list) {
  if (BASE_URL) {
    return BASE_URL;
  }
  const filteredPromises = list.map(async (item) => {
    const result = await checkUrl(item);
    return result;
  });

  const filteredResults = await Promise.all(filteredPromises);

  const workedUrl = filteredResults.find(({ status }) => status);
  return workedUrl.url;
}
