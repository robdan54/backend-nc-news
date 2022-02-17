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
	} else {return Promise.resolve()}
};

exports.selectCommentsByArticle = async (articleId) => {
	const { rows } = await db.query(
		`SELECT * FROM comments
	WHERE article_id = $1;`,
		[articleId]
	);

	return rows;
};

exports.postComment = async (commentInfo, articleId) => {
	const { body, username } = commentInfo;
	const created_at = new Date(Date.now())
	const { rows: [comment] } = await db.query(
		`INSERT INTO comments 
			(body, author, article_id, votes, created_at)
		VALUES
			($1, $2, $3 , 0 , $4)
		RETURNING *;`,
		[body, username, articleId, created_at]
	);
	return comment
};
