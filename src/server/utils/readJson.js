import { writeFileSync, readFileSync } from 'fs'
import { checkUrls } from './checklinks.js'
import { CONTENT_TV } from '../config.js'

export const readJsonId = async (id) => {
  const filePath = './src/torrents/torrents.json'
  const data = readFileSync(filePath, 'utf8')
  const parsedData = await JSON.parse(data)
  return parsedData.find((tor) => tor.id === id)
}

export const readJson = async (path) => {
  try {
    const data = readFileSync(path, 'utf8')
    const parsedData = await JSON.parse(data)
    return parsedData
  } catch (error) {
    console.log(error)
    return null
  }
}

export const createPlaylists = async () => {
  const channels = await readJson(`${CONTENT_TV}/channels.json`)
  const streams = await readJson(`${CONTENT_TV}/streams.json`)
  const playlist = []
  streams.forEach((stream) => {
    const channel = channels.find((el) => el.id === stream.channel)
    if (channel) {
      playlist.push({
        ...channel,
        stream: {
          ...stream
        }
      })
    } else if (stream.channel.trim() === '' && stream.url !== '') {
      playlist.push({
        id: stream.url,
        name: stream.url,
        website: '',
        logo: '',
        country: 'noname',
        is_nsfw: false,
        languages: [''],
        stream: {
          url: stream.url
        }
      })
    }
  })
  writeFileSync(
    `${CONTENT_TV}/playlist.json`,
    JSON.stringify(playlist, null, 2)
  )

  const ru = playlist.filter((el) => el.country.toLowerCase() === 'ru')

  const urlsRu = ru.map((el) => ({
    id: el.id,
    name: el.name,
    logo: el.logo,
    url: el.stream.url,
    website: el.website
  }))

  writeFileSync(`${CONTENT_TV}/ru.json`, JSON.stringify(urlsRu, null, 2))

  const en = playlist.filter(
    (el) => el.languages[0].toLowerCase() === 'eng' && !el.is_nsfw
  )

  const urlsEn = en.map((el) => ({
    id: el.id,
    name: el.name,
    logo: el.logo,
    url: el.stream.url,
    website: el.website
  }))

  writeFileSync(`${CONTENT_TV}/en.json`, JSON.stringify(urlsEn, null, 2))

  const nsfw = playlist.filter((el) => el.is_nsfw)

  const urlsNsfw = nsfw.map((el) => ({
    id: el.id,
    name: el.name,
    logo: el.logo,
    url: el.stream.url,
    website: el.website
  }))

  writeFileSync(`${CONTENT_TV}/nsfw.json`, JSON.stringify(urlsNsfw, null, 2))

  const noname = playlist.filter((el) => el.country === 'noname')

  const urlsNoname = noname.map((el) => ({
    id: el.id,
    name: el.name,
    logo: el.logo,
    url: el.stream.url,
    website: el.website
  }))

  writeFileSync(
    `${CONTENT_TV}/noname.json`,
    JSON.stringify(urlsNoname, null, 2)
  )

  // пока проверка доступа по url не нужна

  const checkedRu = await checkUrls(urlsRu)
  console.log('write checkedRu')
  writeFileSync(
    `${CONTENT_TV}/checkedRu.json`,
    JSON.stringify(checkedRu, null, 2)
  )

  const checkedEn = await checkUrls(urlsEn)
  console.log('write checkedEn')
  writeFileSync(
    `${CONTENT_TV}/checkedEn.json`,
    JSON.stringify(checkedEn, null, 2)
  )

  const checkedNsfw = await checkUrls(urlsNsfw)
  console.log('write checkedNsfw')
  writeFileSync(
    `${CONTENT_TV}/checkedNsfw.json`,
    JSON.stringify(checkedNsfw, null, 2)
  )

  const checkedNoname = await checkUrls(urlsNoname)
  console.log('write checkedNoname')
  writeFileSync(
    `${CONTENT_TV}/checkedNoname.json`,
    JSON.stringify(checkedNoname, null, 2)
  )
}
