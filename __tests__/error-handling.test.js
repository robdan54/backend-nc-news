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
