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
                    expect(topics.length).toBe(3)
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
