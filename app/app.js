import express from 'express';
import http from 'http'; // Добавьте этот импорт
import { Server } from 'socket.io';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';

import passportSetup from './config/passport-setup.js'; // eslint-disable-line
import passport from 'passport';

import 'dotenv/config';

import corsMiddleware from './middlewares/cors.js';

import dbUtils from './utils/db.js';
import testUtils from './utils/test-data.js';

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
// FIX ME
import roleRoute from './routes/role.js';

import { eventEmitter } from './utils/notification.js';

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
            await testUtils.fillWorkload();
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
        maxAge: 24 * 60 * 60 * 1000,
        keys: [process.env.COOKIE_KEY],
    })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(corsMiddleware);

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

io.on('connection', socket => {
    console.log(`socket ${socket.id} connected`);

    eventEmitter.on('notificationCreated', eventData => {
        socket.emit('notificationCreated', eventData);
        console.log('Уведомление отправилось клиенту', eventData);
    });

    socket.on('response', data => {
        socket.emit('response', 'data received');
    });

    // upon disconnection
    socket.on('disconnect', reason => {
        console.log(`socket ${socket.id} disconnected due to ${reason}`);
    });
});

app.use('/auth', authRoute);

console.log(`Node env: ${process.env.NODE_ENV}`);
server.listen(PORT, () => console.log(`Listen on :${PORT}`));
