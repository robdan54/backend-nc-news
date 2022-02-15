/** @format */

const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = async () => {
	const topics = await db.query(`
                SELECT * FROM topics;
            `);
	return topics.rows;
};

exports.selectArticles = async () => {
	const articles = await db.query(
		`SELECT articles.*, CAST(COUNT(comment_id) AS INT) AS comment_count
		 FROM articles 
		 LEFT JOIN comments ON comments.article_id = articles.article_id
		 GROUP BY articles.article_id
		 ORDER BY created_at DESC;`
	);

	// articles.rows.forEach(async (article) => {
	// 	const articleId = article.article_id;
	// 	const comment_counter = await db.query(
	// 		`
	// 	SELECT COUNT(comment_id) FROM comments
	// 	WHERE article_id = $1;
	// `,
	// 		[articleId]
	// 	);
	// 	article.comment_count = Number.parseInt(comment_counter.rows[0].count);
	// });
	return articles.rows;
};

exports.selectArticleById = async (articleId) => {
	const article = await db.query(
		`SELECT articles.*, CAST(COUNT(comment_id) AS INT) AS comment_count
		 FROM articles 
		 LEFT JOIN comments ON comments.article_id = articles.article_id
		 WHERE articles.article_id = $1
		 GROUP BY articles.article_id;`,
		[articleId]
	);
	

	// article.rows[0].comment_count = Number.parseInt(
	// 	comment_counter.rows[0].count
	// );

	return article.rows[0];
};

exports.selectUsers = async () => {
	const users = await db.query(`
        SELECT username FROM users;
    `);
	return users.rows;
};

exports.patchArticle = async (inc_votes, articleID) => {
	try {
		const newArticle = await db.query(
			`UPDATE articles 
             SET votes = votes + $1
        	 WHERE article_id = $2
             RETURNING *;`,
			[inc_votes, articleID]
		);

		return newArticle.rows[0];
	} catch (err) {
		return Promise.reject({ status: 400, msg: '400 - Bad request' });
	}
};

exports.doesResourceExist = async (table, column, value) => {
	let queryStr = format(`SELECT * FROM %I WHERE %I = $1;`, table, column);

	const testId = await db.query(queryStr, [value]);

	if (testId.rows.length === 0) {
		return Promise.reject({ status: 404, msg: 'Resource not found' });
	}
};
