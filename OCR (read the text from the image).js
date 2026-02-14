import fetch from 'node-fetch'

const handler = async (m, { sock, reply }) => {
  try {

    const q = m.quoted ? m.quoted : m
    const mime =
      (q.msg || q).mimetype ||
      q.mimetype ||
      q.message?.imageMessage?.mimetype

    if (!mime || !/image/.test(mime))
      return reply(
        "⚠️ Kirim atau reply gambar dengan caption *ocr* untuk ekstrak teks."
      )

    await sock.sendMessage(m.chat, { react: { text: "⏳", key: m.key } })

    const buffer = await q.download()
    const mimeType = /png/.test(mime) ? "image/png" : "image/jpeg"
    const imageBase64 = buffer.toString("base64")

   
    const url = "https://staging-ai-image-ocr-266i.frontend.encr.app/api/ocr/process"
    const res = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ imageBase64, mimeType }),
    })

    if (!res.ok) throw new Error(await res.text())
    const json = await res.json()

    const text = json.extractedText || "Teks tidak ditemukan."
    reply(`${text}`)

    await sock.sendMessage(m.chat, { react: { text: "✅", key: m.key } })

  } catch (err) {
    console.error(err)
    reply("❌ Gagal melakukan OCR, coba lagi nanti.")
    await sock.sendMessage(m.chat, { react: { text: "❌", key: m.key } })
  }
}

handler.command = ["ocr", "readtext"]
handler.tags = ["tools"]
handler.desc = "Ekstrak teks dari gambar menggunakan OCR"

export default handler