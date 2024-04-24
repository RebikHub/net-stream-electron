import { Router } from 'express'
import {
  // getPlaylist,
  getPlaylistUpdate,
  getPlaylistRu,
  getPlaylistEn,
  getPlaylistNsfw,
  getPlaylisNoname
  // getParserM3u8,
} from '../controllers/tv/tvController.js'

const router = Router()

// router.get('/playlist', getPlaylist)

router.get('/update', getPlaylistUpdate)

router.get('/playlist/ru', getPlaylistRu)

router.get('/playlist/en', getPlaylistEn)

router.get('/playlist/nsfw', getPlaylistNsfw)

router.get('/playlist/noname', getPlaylisNoname)

// router.get("/channel/:item", getParserM3u8);

export default router
