'use strict';

function successResponse(res, data = null, message = 'Success', statusCode = 200) {
  const body = { success: true, message };

  if (data !== null && data !== undefined) {
    body.data = data;
  }

  return res.status(statusCode).json(body);
}

function errorResponse(res, message = 'Internal Server Error', statusCode = 500) {
  return res.status(statusCode).json({ success: false, message });
}

module.exports = { successResponse, errorResponse };
