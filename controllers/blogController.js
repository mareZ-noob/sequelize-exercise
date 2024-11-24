const controller = {};
const { where, Op } = require('sequelize');
const models = require('../models');
const { query } = require('express');

controller.init = async (req, res, next) => {
    res.locals.categories = await models.Category.findAll({
        include: [
            { model: models.Blog }
        ]
    });
    res.locals.tags = await models.Tag.findAll();
    next();
}

controller.showList = async (req, res) => {
    let limit = 2;
    let { category = 0, tag = 0, keyword = "", page = 1 } = req.query;
    category = isNaN(category) ? 0 : parseInt(category);
    tag = isNaN(tag) ? 0 : parseInt(tag);
    page = isNaN(page) ? 1 : parseInt(page);
    let offset = (page - 1) * limit;
    let options = {
        include: [
            { model: models.Comment },
        ],
        where: {}
    }

    if (category) {
        options.where.categoryId = category;
    }

    if (tag) {
        options.include.push({
            model: models.Tag,
            where: {
                id: tag
            }
        });
    }

    if (keyword.trim() != "") {
        options.where[Op.or] = {
            title: {
                [Op.like]: `%${keyword.trim()}%`,
            },
            summary: {
                [Op.like]: `%${keyword.trim()}%`,
            }
        }
    }

    let totalRows = await models.Blog.count({ 
        ...options, 
        distinct: true,
        col: 'id',
    });

    res.locals.pagination = {
        page,
        limit,
        totalRows,
        queryParams: req.query,
    }

    let blogs = await models.Blog.findAll({...options, limit, offset});
    
    res.locals.blogs = blogs;

    res.locals.categories = await models.Category.findAll({
        include: [
            { model: models.Blog }
        ]
    });
    res.locals.tags = await models.Tag.findAll();

    res.render(
        "index",
    );
};

controller.showDetails = async (req, res) => {
    let id = isNaN(req.params.id) ? 0 : parseInt(req.params.id);
    let blog = await models.Blog.findOne({
        where: { id: id },
        include: [
            { model: models.Comment },
            { model: models.Tag },
            { model: models.User },
            { model: models.Category },
        ]
    })
    res.locals.blog = blog;
    res.render(
        "details"
    );
};

module.exports = controller;