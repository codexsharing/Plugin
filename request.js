
/**
 *» Nama : AIO Downloader PRO
 *» Type : Plugin ESM
 *» API  : https://savevideoid.vercel.app
 *» Creator : Kyzo Ymd
 */

import axios from "axios"

async function aioDownload(url) {
  const res = await axios.get(
    `https://savevideoid.vercel.app/api/download?url=${encodeURIComponent(url)}`
  )
  return res.data
}

const handler = async (m, { text, usedPrefix, command, conn }) => {
  if (!text) return m.reply(`Contoh:\n${usedPrefix}${command} https://link`)

  try {
    m.reply("⏳ Downloading media...")

    const data = await aioDownload(text)
    if (!data.success) return m.reply("❌ Gagal download!")

    const results = data.results || []
    if (!results.length) return m.reply("❌ Media tidak ditemukan")

    for (let r of results) {
      let videoUrl = r.hd_url || r.download_url
      let audioUrl = r.music
      let thumb = r.thumbnail

      let caption = `📥 *AIO Downloader*\n\n`
      caption += `🌐 Platform: ${data.platform}\n`
      caption += `📌 Title: ${r.title || "-"}\n`
      caption += `⏱ Duration: ${r.duration || "-"} sec\n`
      caption += `🔗 Source: ${data.original_url}`

      // ================= VIDEO =================
      if (videoUrl) {
        await conn.sendMessage(m.chat, {
          video: { url: videoUrl },
          mimetype: "video/mp4",
          caption
        }, { quoted: m })
      }

      // ================= AUDIO =================
      if (audioUrl) {
        await conn.sendMessage(m.chat, {
          audio: { url: audioUrl },
          mimetype: "audio/mpeg",
          fileName: "aio.mp3"
        }, { quoted: m })
      }

      // ================= THUMB IMAGE =================
      if (thumb) {
        await conn.sendMessage(m.chat, {
          image: { url: thumb },
          caption: "🖼 Thumbnail"
        }, { quoted: m })
      }
    }

  } catch (e) {
    console.error(e)
    m.reply("❌ Error AIO Downloader")
  }
}

handler.help = ["aio"]
handler.tags = ["downloader"]
handler.command = ["aio"]

export default handler