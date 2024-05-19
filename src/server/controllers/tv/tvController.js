import axios from 'axios'
import { CONTENT_TV, PLAYLIST_URL, TV_CHANNELS_URL, TV_STREAMS_URL } from '../../config.js'
import { readJson, createPlaylists } from '../../utils/readJson.js'
import { writeFileSync } from 'fs'
import { parsePlaylist } from '../../utils/parsePlaylist.js'

export const getChannelList = async (path, res) => {
  try {
    const playlist = await readJson(path)
    if (!playlist || playlist.length === 0) {
      axios.get(TV_CHANNELS_URL).then(({ data }) => {
        writeFileSync(
          `${CONTENT_TV}/channels.json`,
          JSON.stringify(data, null, 2)
        )
        axios
          .get(TV_STREAMS_URL)
          .then(({ data }) => {
            writeFileSync(
              `${CONTENT_TV}/streams.json`,
              JSON.stringify(data, null, 2)
            )
            createPlaylists()
          })
          .then(async () => {
            const list = await readJson(path)
            res.status(200).json(list)
          })
      })
    } else {
      res.status(200).json(playlist)
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to response playlist' })
  }
}

export const getPlaylistUpdate = async (req, res) => {
  try {
    axios.get(TV_CHANNELS_URL).then(({ data }) => {
      writeFileSync(
        `${CONTENT_TV}/channels.json`,
        JSON.stringify(data, null, 2)
      )
      axios.get(TV_STREAMS_URL).then(({ data }) => {
        const streamSort = data.filter((stream) => {
          return /\.m3u8$/.test(stream.url)
        })
        writeFileSync(
          `${CONTENT_TV}/streams.json`,
          JSON.stringify(streamSort, null, 2)
        )
        createPlaylists()
        res.status(200).json({ response: 'Playlist ready!' })
      })
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to response playlist' })
  }
}

export const getPlaylistRu = async (req, res) => {
  // await getChannelList("./src/content/tv/ru.json", res);
  await getChannelList(`${CONTENT_TV}/checkedRu.json`, res)
}

export const getPlaylistEn = async (req, res) => {
  // await getChannelList("./src/content/tv/en.json", res);
  await getChannelList(`${CONTENT_TV}/checkedEn.json`, res)
}

export const getPlaylistNsfw = async (req, res) => {
  // await getChannelList("./src/content/tv/nsfw.json", res);
  await getChannelList(`${CONTENT_TV}/checkedNsfw.json`, res)
}

export const getPlaylistNoname = async (req, res) => {
  // await getChannelList("./src/content/tv/noname.json", res);
  await getChannelList(`${CONTENT_TV}/checkedNoname.json`, res)
}

export const getPlaylistAll = async (req, res) => {
  try {
    const playlist = await readJson(`${CONTENT_TV}/all.json`)

    if (!playlist || playlist.length === 0) {
      axios.get(PLAYLIST_URL + 'LoganetXAll.m3u').then((response) => {
        if (response.data) {
          const playlist = parsePlaylist(response.data)
          if (playlist && playlist.length) {
            writeFileSync(
            `${CONTENT_TV}/all.json`,
            JSON.stringify(playlist, null, 2)
            )
            res.status(200).json(playlist)
          }
        }
      })
    } else {
      res.status(200).json(playlist)
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to response playlist' })
  }
}
