/** @format */

exports.handleCustomErrors = (err, req, res, next) => {
	// handle custom errors
	if (err.status && err.msg) {
		//console.log(err);
		res.status(err.status).send({ msg: err.msg });
	} else {
		next(err);
	}
};
// handle specific psql errors
exports.handlePsqlErrors = (err, req, res, next) => {
	if (err.code === '22P02') {
		res.status(400).send({ msg: 'Bad request' });
	} else if (err.code === '23502') {
		res.status(400).send({ msg: 'Bad request' });
	} else {
		next(err);
	}
};
exports.handleServerErrors = (err, req, res, next) => {
	// if the error hasn't been identified,
	// respond with an internal server error
	console.log(err);
	res.status(500).send({ msg: 'Internal Server Error' });
};
