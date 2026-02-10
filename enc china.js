/**
 *» Name : China Encrypt JS
 *» Type : Plugin ESM
 *» Creator : Kyzo Ymd
 */

import fs from 'fs'
import path from 'path'
import JsConfuser from 'js-confuser'
import { fileURLToPath } from 'url'
import { downloadContentFromMessage } from '@whiskeysockets/baileys'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

let handler = async (m, { sock, quoted, reply }) => {
  if (!quoted) return reply('❌ Balas file .js untuk dienkripsi!')

  try {
    const fileName = quoted.fileName || ''
    if (!fileName.endsWith('.js')) return reply('❌ Reply file `.js`!')

    // Mandarin symbol list
    const mandarin = [
      "龙","虎","风","云","山","河","天","地","雷","电","火","水",
      "木","金","土","星","月","日","光","影","峰","泉","林","海",
      "雪","霜","雾","冰","焰","石"
    ]

    const genMandarin = () =>
      Array.from({ length: Math.floor(Math.random() * 4) + 3 },
        () => mandarin[Math.floor(Math.random() * mandarin.length)]
      ).join('')

    const getMandarinObf = () => ({
      target: 'node',
      compact: true,
      renameVariables: true,
      renameGlobals: true,
      identifierGenerator: genMandarin,
      stringEncoding: true,
      stringSplitting: true,
      controlFlowFlattening: 0.95,
      shuffle: true,
      duplicateLiteralsRemoval: true,
      deadCode: true,
      calculator: true,
      opaquePredicates: true,
      lock: {
        selfDefending: true,
        antiDebug: true,
        integrity: true,
        tamperProtection: true
      }
    })

    // Download file
    let stream = await downloadContentFromMessage(quoted, 'document')
    let buffer = Buffer.from([])
    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])
    const raw = buffer.toString('utf8')

    // Validate JS
    try {
      new Function(raw)
    } catch (e) {
      return reply(`❌ File JS tidak valid:\n${e.message}`)
    }

    reply('🧧 Encrypting China Mode...')

    const obf = await JsConfuser.obfuscate(raw, getMandarinObf())
    const code = typeof obf === 'string' ? obf : obf.code

    const outName = `china-encrypted-${Date.now()}.js`
    const outPath = path.join(__dirname, outName)
    fs.writeFileSync(outPath, code)

    const fileBuffer = fs.readFileSync(outPath)

    await sock.sendMessage(m.chat, {
      document: fileBuffer,
      mimetype: 'application/javascript',
      fileName: outName,
      caption: '✅ *Mandarin Encrypt Success!*'
    }, { quoted: m })

    fs.unlinkSync(outPath)

  } catch (err) {
    console.error('CHINA ENC ERROR:', err)
    reply(`❌ Error: ${err.message}`)
  }
}

handler.help = [
  'encchina',
  'encryptchina',
  'encrypt-mandarin',
  'enc-mandarin'
]
handler.tags = ['owner', 'tools']
handler.command = /^(encchina|encryptchina|encrypt-china|chinaenc|china-encrypt|enc-china|encmandarin|encryptmandarin|encrypt-mandarin|mandarinenc|mandarin-encrypt|enc-mandarin)$/i
handler.owner = true

export default handler