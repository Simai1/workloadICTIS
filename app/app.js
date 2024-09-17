import express from 'express';
import http from 'http'; // Добавьте этот импорт
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

import passportSetup from './config/passport-setup.js'; // eslint-disable-line
import passport from 'passport';

import 'dotenv/config';

// import corsMiddleware from './middlewares/cors.js';

import dbUtils from './utils/db.js';
import testUtils from './utils/test-data.js';
import cronService from './services/cron.js';

import commentRoute from './routes/comment.js';
import authRoute from './routes/auth.js';
import parserRoute from './routes/parser.js';
import eduRoute from './routes/educator.js';
import workloadRoute from './routes/workload.js';
import notificationRoute from './routes/notification.js';
import offerRoute from './routes/offers.js';
import userRoute from './routes/user.js';
import colorRoute from './routes/color.js';
import attachesRoute from './routes/attached.js';
import historyRoute from './routes/history.js';
import materialsRoute from "./routes/materials.js";
import apiRoute from "./routes/apiRoute.js";
// FIX ME
import roleRoute from './routes/role.js';
import cors from 'cors';
import { eventEmitter } from './utils/notification.js';
import sendMail from './services/email.js';

const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app); // Создайте сервер с использованием http

const io = new Server(server, {
    cors: {
        origin: '*',
        allowedHeaders: '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    },
});

(async function initDb() {
    try {
        await dbUtils.initializeDbModels();
        if (process.env.NODE_ENV === 'development') {
            // await testUtils.fillWorkload();
            await testUtils.fillEducators();
        }
    } catch (e) {
        console.log(e);
        console.log('COULD NOT CONNECT TO THE DB, retrying in 5 seconds');
        setTimeout(initDb, 5000);
    }
})();

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
    cookieSession({
        maxAge: 30 * 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIE_KEY],
    })
);
app.use(passport.initialize());
app.use(passport.session());
// app.use(corsMiddleware);
app.use(
    cors({
        credentials: true,
        origin: true,
        exposedHeaders: ['*'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);

cronService.checkHours.start();
// cronService.reminderPractice.start();
// cronService.checkActivity.start();

app.use('/comment', commentRoute);
app.use('/notification', notificationRoute);
app.use('/educator', eduRoute);
app.use('/parser', parserRoute);
app.use('/workload', workloadRoute);
app.use('/auth', authRoute);
app.use('/user', userRoute);
app.use('/offers', offerRoute);
app.use('/role', roleRoute);
app.use('/color', colorRoute);
app.use('/attaches', attachesRoute);
app.use('/history', historyRoute);
app.use('/materials', materialsRoute);
app.use('/api', apiRoute);
app.route('/test').get(async (req, res)=> {
    sendMail(process.env.EMAIL_RECIEVER, 'lectorInvite');
    res.json({status: "OK"});
})

app.get('/', (req, res) => {
    res.send(`
        <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f0f0f0;
                        color: #333;
                    }
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 50px;
                    }
                    th, td {
                        border: 1px solid #ddd;
                        padding: 8px;
                        text-align: left;
                    }
                    th {
                        background-color: #4CAF50;
                        color: white;
                        text-align: center; /* Центрирование текста */
                    }
                    th:hover {
                        cursor: pointer;
                        background-color: #45a049; /* Изменяемый фон при наведении */
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align: center;">Добро пожаловать в распределение нагрузки ЮФУ!</h1>
                <table>
                    <tr>
                        <th onclick="location.href='http://localhost:3000/client';">Чтобы зайти на сайт нажмите сюда.</th>
                    </tr>
                </table>
            </body>
        </html>
    `);
});

io.on('connection', socket => {
    console.log(`socket ${socket.id} connected`);

    eventEmitter.on('notificationCreated', eventData => {
        socket.emit('notificationCreated', eventData);
        console.log('Уведомление отправилось клиенту', eventData);
    });

    socket.on('response', () => {
        socket.emit('response', 'data received');
    });

    let editingUser = null;

    // Обработчик события начала редактирования
    socket.on('startEditing', () => {
        // Если никто не редактирует систему в данный момент
        if (!editingUser) {
            // Запоминаем пользователя, который начал редактирование
            editingUser = socket.id;
            // Отправляем уведомление всем остальным пользователям о блокировке системы
            socket.broadcast.emit('systemLocked');
        } else {
            // Если кто-то уже редактирует систему, отправляем уведомление только текущему пользователю
            socket.emit('systemLocked');
        }
    });

    // Обработчик события окончания редактирования
    socket.on('stopEditing', () => {
        // Проверяем, что пользователь, отправивший событие, действительно редактировал систему
        if (socket.id === editingUser) {
            // Сбрасываем информацию о пользователе, который редактировал систему
            editingUser = null;
            // Отправляем уведомление всем остальным пользователям о разблокировке системы
            socket.broadcast.emit('systemUnlocked');
        }
    });

    // Обработчик отключения пользователя
    socket.on('disconnect', reason => {
        // Если отключается пользователь, который редактировал систему, разблокируем систему для всех
        if (socket.id === editingUser) {
            editingUser = null;
            socket.broadcast.emit('systemUnlocked');
        }
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
});

app.use('/auth', authRoute);

console.log(`Node env: ${process.env.NODE_ENV}`);
server.listen(PORT, () => console.log(`Listen on :${PORT}`));
