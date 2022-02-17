/** @format */
const testData = require('../db/data/test-data');
const request = require('supertest');
const app = require('../app');
const db = require('../db/connection');
const seed = require('../db/seeds/seed');

process.env.NODE_ENV = 'test';

beforeEach(() => seed(testData));

afterAll(() => {
	if (db.end) db.end();
});

describe('/api/topics', () => {
	describe('GET', () => {
		test('should respond with an array of topic objects', () => {
			return request(app)
				.get('/api/topics')
				.expect(200)
				.then(({ body }) => {
					const { topics } = body;
					expect(topics).toBeInstanceOf(Array);
					expect(topics.length).toBe(3);
					topics.forEach((topic) => {
						expect(topic).toEqual(
							expect.objectContaining({
								slug: expect.any(String),
								description: expect.any(String),
							})
						);
					});
				});
		});
	});
});

describe('/api/articles/:article_id', () => {
	describe('GET', () => {
		test('should respond with an article object based on the id given', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toBeInstanceOf(Object);
					expect(article).toEqual(
						expect.objectContaining({
							title: 'Living in the shadow of a great man',
							topic: 'mitch',
							author: 'butter_bridge',
							body: 'I find this existence challenging',
							created_at: expect.any(String),
							votes: 100,
							article_id: 1,
						})
					);
				});
		});
		test('should return a different article if given a different id', () => {
			return request(app)
				.get('/api/articles/2')
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toBeInstanceOf(Object);
					expect(article).toEqual(
						expect.objectContaining({
							title: 'Sony Vaio; or, The Laptop',
							topic: 'mitch',
							author: 'icellusedkars',
							body: 'Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.',
							created_at: expect.any(String),
							votes: 0,
							article_id: 2,
						})
					);
				});
		});
		test('should include a comment counter in the article object', () => {
			return request(app)
				.get('/api/articles/1')
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article.comment_count).toBe(11);
				});
		});
	});

	describe('GET ERRORS', () => {
		test('should return 404 resource not found if given a valid id type, but the id does not exist', () => {
			return request(app)
				.get('/api/articles/999999')
				.expect(404)
				.then(({ body }) => {
					const { msg } = body;
					expect(msg).toBe('Resource not found');
				});
		});
	});

	describe('PATCH', () => {
		test('should respond with an updated article object based on the received object', () => {
			return request(app)
				.patch('/api/articles/1')
				.send({ inc_votes: 1 })
				.expect(200)
				.then(({ body }) => {
					const { article } = body;
					expect(article).toBeInstanceOf(Object);
					expect(article).toEqual(
						expect.objectContaining({
							title: 'Living in the shadow of a great man',
							topic: 'mitch',
							author: 'butter_bridge',
							body: 'I find this existence challenging',
							created_at: expect.any(String),
							votes: 101,
							article_id: 1,
						})
					);
				});
		});
		describe('PATCH errors', () => {
			test('should respond with an error message when given an invalid id', () => {
				return request(app)
					.patch('/api/articles/Invalid_id')
					.send({ inc_votes: 1 })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe('400 - Bad request');
					});
			});
			test('should respond with an error message when given an invalid update object', () => {
				return request(app)
					.patch('/api/articles/1')
					.send({ notAVaildProperty: 'Not a value' })
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe('400 - Bad request');
					});
			});
		});
	});
});

describe('/api/users', () => {
	describe('GET', () => {
		test('should respond with an array of user objects with a username property', () => {
			return request(app)
				.get('/api/users')
				.expect(200)
				.then(({ body }) => {
					const { users } = body;
					expect(users).toBeInstanceOf(Array);
					expect(users.length).toEqual(4);
					users.forEach((user) => {
						expect(user).toEqual(
							expect.objectContaining({
								username: expect.any(String),
							})
						);
					});
				});
		});
	});
});

describe('/api/articles', () => {
	describe('GET', () => {
		test('Should respond with an array of article objects', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeInstanceOf(Array);
					expect(articles.length).toBe(12);
					articles.forEach((article) => {
						expect(article).toEqual(
							expect.objectContaining({
								author: expect.any(String),
								title: expect.any(String),
								article_id: expect.any(Number),
								topic: expect.any(String),
								created_at: expect.any(String),
								votes: expect.any(Number),
							})
						);
					});
				});
		});
		test('should be sorted by date in descending order', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					expect(articles).toBeInstanceOf(Array);
					expect(articles).toBeSortedBy('created_at', { descending: true });
				});
		});
		test('should include a comment counter in the article object', () => {
			return request(app)
				.get('/api/articles')
				.expect(200)
				.then(({ body }) => {
					const { articles } = body;
					articles.forEach((article) => {
						expect(article).toEqual(
							expect.objectContaining({
								comment_count: expect.any(Number),
							})
						);
					});
				});
		});
		describe('Queries', () => {
			test('should allow the user to specify a column to sort_by and sort by that column defaults to descending', () => {
				const article_idTest = request(app)
					.get('/api/articles?sort_by=article_id')
					.expect(200)
					.then(({ body }) => {
						const { articles } = body;
						expect(articles).toBeSortedBy('article_id', { descending: true });
					});
				const comment_countTest = request(app)
					.get('/api/articles?sort_by=comment_count')
					.expect(200)
					.then(({ body }) => {
						const { articles } = body;
						expect(articles).toBeSortedBy('comment_count', {
							descending: true,
						});
					});
				return Promise.all([article_idTest, comment_countTest]);
			});
			test('should allow a user to specify ordering', () => {
				return request(app)
					.get('/api/articles?order=asc')
					.expect(200)
					.then(({ body }) => {
						const { articles } = body;
						expect(articles).toBeSortedBy('created_at', { descending: false });
					});
			});
			test('should allow a user to filter by topic', () => {
				return request(app)
					.get('/api/articles?topic=mitch')
					.expect(200)
					.then(({ body }) => {
						const { articles } = body;
						articles.forEach((article) => {
							expect(article.topic).toBe('mitch');
						});
					});
			});
			describe('Query ERRORS', () => {
				test('should return 400 invalid sort_by if given an incorrect sort_by', () => {
					return request(app)
						.get('/api/articles?sort_by=InvalidSortBy')
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).toBe('Invalid sort_by');
						});
				});
				test('should return 400 invalid order if given an incorrect order', () => {
					return request(app)
						.get('/api/articles?order=InvalidOrder')
						.expect(400)
						.then(({ body: { msg } }) => {
							expect(msg).toBe('Invalid order');
						});
				});
				test('should return 404 topic not found if given a valid but non existent incorrect topic', () => {
					return request(app)
						.get('/api/articles?topic=notATopic')
						.expect(404)
						.then(({ body: { msg } }) => {
							expect(msg).toBe('Topic not found');
						});
				});
			});
		});
	});
});

describe('/api/articles/:article_id/comments', () => {
	describe('GET', () => {
		test('should respond with an  array of comment objects related to the given article', () => {
			return request(app)
				.get('/api/articles/1/comments')
				.expect(200)
				.then(({ body: { comments } }) => {
					comments.forEach((comment) => {
						expect(comment).toEqual(
							expect.objectContaining({
								article_id: 1,
								comment_id: expect.any(Number),
								votes: expect.any(Number),
								created_at: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
							})
						);
					});
				});
		});
		test('should respond with an empty comments array if the id given has no comments', () => {
			return request(app)
				.get('/api/articles/2/comments')
				.expect(200)
				.then(({ body: { comments } }) => {

					expect(comments).toEqual([]);
				});
		});
		describe('GET ERRORS', () => {
			test('should return 404 resource not found if given a valid id but the article does not exist ', () => {
				return request(app)
					.get('/api/articles/99999/comments')
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Resource not found');
					});
			});
			test('should return 400 bad request if given an invalid id format', () => {
				return request(app)
					.get('/api/articles/not-an-Id/comments')
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
		});
	});
	describe('POST', () => {
		test('should respond with 201 and the new comment object after receiving a username and body', () => {
			return request(app)
				.post('/api/articles/2/comments')
				.send({ username: 'butter_bridge', body: 'test body' })
				.expect(201)
				.then(({ body: { comment } }) => {
					expect(comment).toEqual({
						comment_id: 19,
						votes: 0,
						created_at: expect.any(String),
						author: 'butter_bridge',
						body: 'test body',
						article_id: 2,
					});
				});
		});
		test('should add a new comment to the article', () => {
			return request(app)
				.post('/api/articles/2/comments')
				.send({ username: 'butter_bridge', body: 'test body' })
				.then(() => {
					return request(app)
						.get('/api/articles/2/comments')
						.then(({ body: { comments } }) => {
							expect(comments).toEqual([
								{
									comment_id: 19,
									votes: 0,
									created_at: expect.any(String),
									author: 'butter_bridge',
									body: 'test body',
									article_id: 2,
								},
							]);
						});
				});
		});
		describe('POST ERRORS', () => {
			test('should return 404 - Resource not found if given a valid id but the article does not exist', () => {
				return request(app)
					.post('/api/articles/99999/comments')
					.send({ username: 'butter_bridge', body: 'test body' })
					.expect(404)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Resource not found');
					});
			});
			test('should return 400 Bad request if given an invalid id type', () => {
				return request(app)
					.post('/api/articles/this-is-not-an-id/comments')
					.send({ username: 'butter_bridge', body: 'test body' })
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
			test('should return 400 Bad request if given an invalid comment object', () => {
				return request(app)
					.post('/api/articles/1/comments')
					.send({ notACommentObject: 'or property' })
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
			test('should return 400 Bad request if given a valid key, but with an invalid value', () => {
				return request(app)
					.post('/api/articles/1/comments')
					.send({ username: 'NOT-A-USERNAME' , body: 'test body'})
					.expect(400)
					.then(({ body: { msg } }) => {
						expect(msg).toBe('Bad request');
					});
			});
		});
	});
});

describe('Global Errors', () => {
	test('should return 404 - path not found when given a non existent path', () => {
		return request(app)
			.get('/not-a-path')
			.expect(404)
			.then(({ body }) => {
				expect(body.msg).toBe('404 - path not found');
			});
	});
});
