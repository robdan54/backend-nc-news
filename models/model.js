const db = require('../db/connection')

exports.selectTopics = async () => {
    const topics = await db.query(`
                SELECT * FROM topics;
            `)
    return topics.rows
}