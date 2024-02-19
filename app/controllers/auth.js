import { AppErrorAlreadyExists, AppErrorMissing } from '../utils/errors.js';
import jwt from '../utils/jwt.js';
import UserDto from '../dtos/user-dto.js';
import User from '../models/user.js';

export default {
    async login({ body: { login, password, name } }, res) {
        if (!login) throw new AppErrorMissing('login');
        if (!password) throw new AppErrorMissing('password');
        if (!name) throw new AppErrorMissing('name');

        const CheckUser = await User.findOne({ where: { login } });
        if (CheckUser) throw new AppErrorAlreadyExists('user');

        const user = await User.create({
            login,
            password,
            name,
        });

        const userDto = new UserDto(user);
        const { accessToken, refreshToken } = jwt.generate({ ...userDto });

        await jwt.saveToken(userDto.id, refreshToken);

        res.cookie('refreshToken', refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true,
        });

        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userDto,
        });
    },
};
