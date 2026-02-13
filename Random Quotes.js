
import fetch from "node-fetch"

let handler = async (m, { reply }) => {
  try {
    await reply("📖 Mengambil quotes...")

    const res = await fetch(
      "https://raw.githubusercontent.com/codexsharing/botfitur/refs/heads/main/QUOTES.json"
    )

    if (!res.ok) throw new Error("Gagal fetch data")

    const data = await res.json()

    if (!Array.isArray(data) || !data.length)
      throw new Error("Data quotes kosong")

    const random = data[Math.floor(Math.random() * data.length)]

    const teks = `
✨ *Random Quote*

"${random.quote}"

— ${random.author}
📂 Kategori: ${random.category}
`.trim()

    reply(teks)
  } catch (err) {
    console.error(err)
    reply("❌ Gagal mengambil quotes")
  }
}

handler.help = ["quote", "randomquote"]
handler.tags = ["fun"]
handler.command = ["quote", "quotes", "randomquote"]

export default handler