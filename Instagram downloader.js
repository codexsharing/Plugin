import axios from "axios"

const handler = async (m, { sock, text, reply }) => {
  try {
    if (!text) return reply("❌ Masukkan link Instagram")
    if (!text.includes("instagram.com")) return reply("❌ Link tidak valid")

    reply("⏳ Mengambil media Instagram...")

    const api = `https://api-faa.my.id/faa/igdl?url=${encodeURIComponent(text)}`
    const res = await axios.get(api, { timeout: 20000 })

    if (!res.data?.status) return reply("❌ Gagal mengambil media")

    const data = res.data.result
    const urls = data.url || []
    const meta = data.metadata || {}

    if (!urls.length) return reply("❌ Media tidak ditemukan")

    let caption = `📥 Instagram Downloader\n\n`
    caption += `👤 User: ${meta.username || "-"}\n`
    caption += `❤️ Like: ${meta.like || 0}\n`
    caption += `💬 Comment: ${meta.comment || 0}\n`
    caption += `🎥 Video: ${meta.isVideo ? "Yes" : "No"}\n\n`
    caption += meta.caption || ""

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i]

      if (meta.isVideo) {
        await sock.sendMessage(
          m.chat,
          { video: { url }, caption: i === 0 ? caption : "" },
          { quoted: m }
        )
      } else {
        await sock.sendMessage(
          m.chat,
          { image: { url }, caption: i === 0 ? caption : "" },
          { quoted: m }
        )
      }
    }

  } catch (err) {
    console.error("IGDL ERROR:", err)
    reply("❌ Error: " + (err.message || "Unknown error"))
  }
}

handler.help = ["igdl"]
handler.tags = ["downloader"]
handler.command = ["igdl", " Instagram", "ig"]

export default handler