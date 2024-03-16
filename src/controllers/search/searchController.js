import TorrentSearchApi from "torrent-search-api";
import parseTorrent from "parse-torrent";

import axios from "axios";
import * as cheerio from "cheerio";

export const getSearchMovie = async (req, res) => {
  const movie = req.params.movie;

  try {
    await TorrentSearchApi.enablePublicProviders();

    const torrents = await TorrentSearchApi.search(movie);

    res.status(200).send(torrents);
  } catch (error) {
    console.error("Ошибка при запросе данных:", error);
    res.status(400).send("Ошибка запроса");
  }
};

export const postSearchMagnet = async (req, res) => {
  const movie = req.body;
  try {
    const torrent = await TorrentSearchApi.getMagnet(movie);
    const magnet = await parseTorrent(torrent.magnet);

    res.status(200).json(magnet.infoHash);
  } catch (error) {
    console.error("Ошибка при запросе данных:", error);
    res.status(400).send("Ошибка запроса");
  }
};

export const RUTOR_URL = "https://rutor.org";
// https://6-ffyg.123tt.ru/search/0/1/000/0
// https://3-new-rutor.123rutor.su

// https://9-fkqg.123tt.ru/

const BASE_URL = "https://6-ffyg.123tt.ru";
export const BASE_SEARCH_URL = "https://6-ffyg.123tt.ru/search/0/1/000/0";
export const MAGNET_KEY = "magnet:?xt";
export const SPLIT_MAGNET_STRING = "urn:btih:";

export const IMDB_SEARCH_URL = "https://api.themoviedb.org/3";

export const movieSearch = async (req, res) => {
  const movie = req.params.movie;

  try {
    const searchResult = await axios.get(`${BASE_SEARCH_URL}/${movie}`);
    const $ = cheerio.load(searchResult.data);

    const data = $("#index tr").toArray();

    const torrents = [
      ...data
        .map((item) => {
          const [date, links, , gb] = $(item).find("td").toArray();
          const [, title] = $(links).find("a").toArray();

          const trackerLink = $(title).attr("href");
          const name = $(title).text();
          const dateText = $(date).text();
          const gbText = $(gb).text();

          return {
            urlTorrent: trackerLink,
            nameTorrent: name,
            dateTorrent: dateText,
            gbTorrent: gbText,
          };
        })
        .filter((item) => item.urlTorrent),
    ];

    res.status(200).send(torrents);
  } catch (error) {
    console.error("Ошибка при запросе данных:", error);
    res.status(400).send("Ошибка запроса");
  }
};

export const magnetSearch = async (req, res) => {
  const data = req.body;
  console.log(data);
  try {
    const searchResult = await axios.get(`${BASE_URL}${data.data}`);
    const $ = cheerio.load(searchResult.data);

    const downloadLink = $("#download a").toArray();
    const magnetLink = $(downloadLink[0]).attr("href");
    console.log(magnetLink);
    const magnet = await parseTorrent(magnetLink);

    res.status(200).json({ link: magnet.infoHash });
  } catch (error) {
    console.error("Ошибка при запросе данных:", error);
    res.status(400).send("Ошибка запроса");
  }
};
