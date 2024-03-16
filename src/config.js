export const PORT = process.env.PORT || 8000;
export const WEBTORRENT_DOWNLOAD_PATH = './downloads';
export const TV_CHANNELS_URL = 'https://iptv-org.github.io/api/channels.json';
export const TV_STREAMS_URL = 'https://iptv-org.github.io/api/streams.json';
// Другие конфигурационные параметры...


// export interface ChannelsType {
//   id: string
//   name: string
//   alt_names: string[]
//   network: string
//   owners: string[]
//   country: string
//   subdivision: string
//   city: string
//   broadcast_area: string[]
//   languages: string[]
//   categories: string[]
//   is_nsfw: boolean
//   launched: string
//   closed: string
//   replaced_by: string
//   website: string
//   logo: string
// }

// export interface StreamsType {
//   channel: string
//   url: string
//   http_referrer: string
//   user_agent: string
// }