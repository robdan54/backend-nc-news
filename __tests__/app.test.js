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
                    expect(users).toBeInstanceOf(Array)
                    expect(users.length).toEqual(4)
                    users.forEach((user) => {
                        expect(user).toEqual(
                            expect.objectContaining({
                                username: expect.any(String)
                            })
                        )
                    })
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
