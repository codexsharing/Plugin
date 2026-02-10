import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { text, usedPrefix, command, sock, reply }) => {
  if (!text) return reply(`Contoh:\n${usedPrefix + command} k3g song`)

  try {
    await reply('🎧 Mencari lagu...')

    const api = `https://api.apocalypse.web.id/download/play?q=${encodeURIComponent(text)}&bitrate=192`
    const res = await axios.get(api)
    const json = res.data

    if (!json.status || !json.result) return reply('❌ Lagu tidak ditemukan')

    const r = json.result

    let thumbBuffer = Buffer.alloc(0)
    try {
      const thumb = await fetch(r.thumbnail)
      thumbBuffer = Buffer.from(await thumb.arrayBuffer())
    } catch (e) {
      console.log('Thumbnail error:', e)
    }

    await sock.sendMessage(m.chat, {
      audio: { url: r.download_url },
      mimetype: 'audio/mpeg',
      fileName: `${r.title}.mp3`,
      contextInfo: {
        externalAdReply: {
          title: r.title,
          body: `Channel: ${r.channel} | Duration: ${r.duration}`,
          mediaType: 2,
          thumbnail: thumbBuffer,
          mediaUrl: r.download_url,
          sourceUrl: r.download_url,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: m })

  } catch (e) {
    console.error('PLAY ERROR:', e)
    reply('❌ Error play music')
  }
}

handler.help = ['play <judul lagu>']
handler.tags = ['music']
handler.command = ['play']

export default handler