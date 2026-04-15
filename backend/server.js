const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.post('/log', async (req, res) => {
  try {
    // 1. Получаем IP клиента из заголовков Google Cloud (или самого запроса)
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // 2. Сами идем в ip-api (с сервера это бесплатно и без HTTPS проблем)
    const geoRes = await fetch(`http://ip-api.com/json/${clientIp}`);
    const geo = await geoRes.json();

    // 3. Объединяем данные от фронтенда и гео-данные
    const fullLog = {
      ...req.body,
      ip: geo.query || clientIp,
      city: geo.city,
      country: geo.country,
      isp: geo.isp,
      timezone: geo.timezone
    };

    console.log('New log received:', fullLog);
    
    // Тут можно сохранить в PostgreSQL (твоя БД "La Mirage")
    // await db.query('INSERT INTO logs ...'); 

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Logging error:', error);
    res.status(500).json({ error: 'Internal error' });
  }
});

app.listen(80, '0.0.0.0', () => {
  console.log('Server running on port 80');
});