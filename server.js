const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "*",  //Разрешить все источники (только для разработки!)
    methods: ["GET", "POST"]
  }
});
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Обработчик для обновления списка использованных ID (заглушка)
app.post('/update-used-ids', (req, res) => {
    // В реальном приложении здесь нужно обновить список использованных ID в базе данных.
    // Пока просто возвращаем успешный ответ.
    console.log('Получен запрос на обновление списка использованных ID:', req.body);
    res.status(200).send('Список ID обновлен');
});


io.on('connection', (socket) => {
  console.log('Пользователь подключился:', socket.id);

  socket.on('user_connected', (userId) => {
        console.log(`Пользователь ${userId} подключился.`);
        socket.userId = userId;  // Сохраняем ID пользователя в объекте socket
    });

  socket.on('send_message', (data) => {
    console.log('Получено сообщение:', data);
    // Отправляем сообщение целевому пользователю
    io.emit('receive_message', data); // Отправляем всем клиентам, чтобы они сами фильтровали.
    // Альтернатива (более эффективная):
    // io.to(data.toUserId).emit('receive_message', data);  // если мы будем хранить соответствие socket.id -> userId
  });

  socket.on('disconnect', () => {
    console.log('Пользователь отключился:', socket.id);
  });
});

server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});