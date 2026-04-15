const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const BOT_TOKEN = '8037902437:AAEp23tk69c5uPaKsmrDDR94GxQ20gteLZA';
const CHAT_ID = '7296445298';

async function sendToTelegram(visitor) {
  const text = Object.entries(visitor)
    .map(([key, val]) => `<b>${key}:</b> ${val}`)
    .join('\n');

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text,
      parse_mode: 'HTML',
    }),
  });
}

app.post('/log', async (req, res) => {
  const ip =
    req.headers['x-forwarded-for']?.split(',')[0].trim() ||
    req.socket.remoteAddress;

  const visitor = {
    ip,
    ...req.body,
    receivedAt: new Date().toISOString(),
  };

  console.log('Новый посетитель:', visitor);

  try {
    await sendToTelegram(visitor);
  } catch (err) {
    console.error('Ошибка отправки в Telegram:', err.message);
  }

  res.json({ ok: true });
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
