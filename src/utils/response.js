const response = (res, statusCode, resBody) => {
    return res.status(statusCode).send(resBody)
}

module.exports = response;