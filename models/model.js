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

exports.patchArticle = async (inc_votes, articleID) => {
	try {
		const newArticle = await db.query(
			`
                                        UPDATE articles 
                                        SET votes = votes + $1
                                        WHERE article_id = $2
                                        RETURNING *;
                                        `,
			[inc_votes, articleID]
		);

		return newArticle.rows[0];
	} catch (err) {
		return Promise.reject({ status: 400, msg: '400 - Bad request' });
	}

};
