import { AppErrorMissing } from '../utils/errors.js';
import Comment from '../models/comment.js';
import CommentDto from '../dtos/comment-dto.js';
import Educator from '../models/educator.js';
import User from '../models/user.js';

export default {
    async createComment({ body: { workloadId, text }, user }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');
        if (!text) throw new AppErrorMissing('text');
        const sender = await Educator.findOne({ where: { userId: user } });

        const comment = await Comment.create({
            educatorId: sender.id,
            workloadId,
            text,
        });
        res.json(comment);
    },

    async deleteComment(req, res) {
        const { commentId } = req.params;
        if (!commentId) throw new AppErrorMissing('commentId');
        const _user = await User.findByPk(req.user, { include: Educator });
        if (!_user) throw new AppErrorMissing('user');
        let comment = await Comment.findByPk(commentId);
        if(_user.role === 2 || _user.role === 3 || _user.role === 8) {
            if(comment.educatorId !== _user.Educator.id) res.status(409).json('Is not your comment');
            else await comment.destroy({ force: true });

        } else {
            await comment.destroy({ force: true });
        }
        
        res.status(200).json('Successfully deleted');
    },

    async getOwnComments(req, res) {
        const educator = await Educator.findOne({
            where: { userId: req.user },
            include: [{ model: User }],
        });
        const comments = await Comment.findAll({
            where: { educatorId: educator.id },
            include: [{ model: Educator }],
        });

        const commentDtos = [];

        for (const comment of comments) {
            const commentsDto = new CommentDto(comment);
            commentDtos.push(commentsDto);
        }

        res.json(commentDtos);
    },

    async getAllComments(req, res) {
        const comments = await Comment.findAll({
            include: [{ model: Educator }],
        });

        const commentDtos = [];

        for (const comment of comments) {
            const commentsDto = new CommentDto(comment);
            commentDtos.push(commentsDto);
        }

        res.json(commentDtos);
    },

    async deleteAllComments({ params: { workloadId } }, res) {
        if (!workloadId) throw new AppErrorMissing('workloadId');
        const comments = await Comment.findAll({ where: { workloadId } });
        if (comments.length === 0) {
            res.send('No comments found for the specified workload');
            return;
        }
        for (const comment of comments) {
            await comment.destroy({ force: true });
        }
        res.send('All comments deleted');
    },

    async getCommentsWorkload({ params: { workloadId } }, res) {
        const comments = await Comment.findAll({ where: { workloadId }, include: { model: Educator } });
        if (comments.length === 0) {
            res.send('No comments found for the specified workload');
            return;
        }
        const commentDtos = [];
        for (const comment of comments) {
            const commentDto = new CommentDto(comment);
            commentDtos.push(commentDto);
        }
        res.json(commentDtos);
    },
};
