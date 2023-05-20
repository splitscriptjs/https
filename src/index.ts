import * as https from 'node:https'
import * as http from 'node:http'
import { isHttps, parseData, toQuery } from './utils.js'
type Request = http.RequestOptions & {
	body?: any
	params?: object
}

type requestRes = {
	res: http.IncomingMessage
	data: string | object
}
/**
 * Send a `http(s)` request
 *
 * Defaults to `GET` method
 */
export function request(
	url: string,
	options: Request = { method: 'GET' }
): Promise<requestRes> {
	if (!url.startsWith('https://') && !url.startsWith('http://')) {
		url = (options.port === 80 ? 'http://' : 'https://') + url
	}
	const client = isHttps(url, options) ? https : http
	if (options.params) {
		url += toQuery(options.params)
	}
	return new Promise((resolve, reject) => {
		const req = client.request(url, options, (res) => {
			let data = ''

			res.setEncoding('utf-8')
			res.on('data', (chunk: string) => {
				data += chunk
			})

			res.on('end', () => {
				resolve({ res, data: parseData(res, data) })
			})
		})
		req.on('error', reject)
		if (options.body) {
			req.write(Buffer.from(JSON.stringify(options.body)))
		}
		req.end()
	})
}
/** Sends a `GET` request */
export function get(
	url: string,
	options: Request = { method: 'GET' }
): Promise<requestRes> {
	return request(url, { method: 'GET', ...options })
}
/** Sends a `POST` request */
export function post(
	url: string,
	options: Request = { method: 'POST' }
): Promise<requestRes> {
	return request(url, { method: 'POST', ...options })
}
/** Sends a `PUT` request */
export function put(
	url: string,
	options: Request = { method: 'PUT' }
): Promise<requestRes> {
	return request(url, { method: 'PUT', ...options })
}
/** Sends a `PATCH` request */
export function patch(
	url: string,
	options: Request = { method: 'PATCH' }
): Promise<requestRes> {
	return request(url, { method: 'PATCH', ...options })
}
/** Sends a `DELETE` request */
function _delete(
	url: string,
	options: Request = { method: 'DELETE' }
): Promise<requestRes> {
	return request(url, { method: 'DELETE', ...options })
}
export { _delete as delete }
export default { request, get, post, put, patch, delete: _delete }
