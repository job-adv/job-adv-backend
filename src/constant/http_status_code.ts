interface http_code {
  ok: number,
  No_Content: number,
  bad_request: number,
  Forbidden: number,
  not_found: number,
  serverError: number,
  unauthorized: number
}

const http_status_code: http_code = Object.freeze({
  ok: 200,
  No_Content: 204,
  bad_request: 400,
  unauthorized: 401,
  Forbidden: 403,
  not_found: 404,
  serverError: 500
});


export default http_status_code;


