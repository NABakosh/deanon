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

  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });
  } catch (err) {
    console.error('Telegram API Error:', err.message);
  }
}

app.post('/log', async (req, res) => {
  // Определяем IP
  const rawIp = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress;
  
  // Убираем IPv6 префикс, если он есть (::ffff:)
  const cleanIp = rawIp.replace(/^.*:/, '');

  try {
    // Получаем гео-данные на сервере (это не блокируется Mixed Content)
    const geoRes = await fetch(`http://ip-api.com/json/${cleanIp}`);
    const geo = await geoRes.json();

    const visitor = {
      ip: cleanIp,
      city: geo.city || 'Unknown',
      country: geo.country || 'Unknown',
      isp: geo.isp || 'Unknown',
      ...req.body, // данные из хука (userAgent, screen, page)
      receivedAt: new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' }),
    };

    console.log('Новый посетитель:', visitor);

    // Отправляем в ТГ
    await sendToTelegram(visitor);
    
    res.json({ ok: true });
  } catch (err) {
    console.error('Ошибка обработки лога:', err.message);
    res.status(500).json({ ok: false });
  }
});

// Запуск на порту 80
app.listen(80, '0.0.0.0', () => {
  console.log('Server running on port 80 (0.0.0.0)');
});