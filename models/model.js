/** @format */

const db = require('../db/connection');
const format = require('pg-format');

exports.selectTopics = async () => {
	const topics = await db.query(`
                SELECT * FROM topics;
            `);
	return topics.rows;
};

exports.selectArticles = async (sort_by, order, topic) => {
	if (!sort_by) sort_by = 'created_at';
	if (!order) order = 'DESC';

	const validOrder = ['DESC', 'ASC'];

	const validSortBys = [
		'created_at',
		'article_id',
		'author',
		'title',
		'topic',
		'votes',
		'comment_count',
	];

	const queryArr = [];

	let queryStr = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, CAST(COUNT(comment_id) AS INT) AS comment_count
				 	FROM articles 
				 	LEFT JOIN comments ON comments.article_id = articles.article_id`;

	if (topic) {
		queryStr += ' WHERE topic = $1';
		queryArr.push(topic);
	}

	queryStr += ` GROUP BY articles.article_id`;

	if (validSortBys.includes(sort_by)) {
		if (validOrder.includes(order.toUpperCase())) {
			queryStr += ` ORDER BY ${sort_by} ${order}`;
		} else {
			return Promise.reject({ status: 400, msg: 'Invalid order' });
		}
	} else {
		return Promise.reject({ status: 400, msg: 'Invalid sort_by' });
	}

	const { rows } = await db.query(queryStr + ';', queryArr);

	if (rows.length === 0) {
		return Promise.reject({ status: 404, msg: 'Topic not found' });
	}

	return rows;
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
	}
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
	const created_at = new Date(Date.now());
	const {
		rows: [comment],
	} = await db.query(
		`INSERT INTO comments 
			(body, author, article_id, votes, created_at)
		VALUES
			($1, $2, $3 , 0 , $4)
		RETURNING *;`,
		[body, username, articleId, created_at]
	);
	return comment;
};
