/** @format */

const db = require('../db/connection');

exports.selectTopics = async () => {
	const topics = await db.query(`
                SELECT * FROM topics;
            `);
	return topics.rows;
};

exports.selectArticleById = async (articleId) => {
	const article = await db.query(
		`
                                    SELECT * FROM articles WHERE article_id = $1
                                    `,
		[articleId]
	);
	return article.rows[0];
};

exports.selectUsers = async () => {
	const users = await db.query(`
                                SELECT username FROM users;
    `);
    return users.rows
};
