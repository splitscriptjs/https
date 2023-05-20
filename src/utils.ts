import { RequestOptions } from 'https'
import { IncomingMessage } from 'http'
export function isHttps(url: string, options: RequestOptions = {}): boolean {
	return url.startsWith('https://') || options.port === 443
}
export function parseData(res: IncomingMessage, data: any): string | object {
	const type = res.headers['content-type']?.split(';')[0].trim()
	if (type === 'application/json') {
		return JSON.parse(data)
	} else return data
}
export function toQuery(obj: object) {
	const queryString = Object.entries(obj)
		.map(([key, val]) => {
			const stringified = typeof val === 'string' ? val : JSON.stringify(val)
			return `${key}=${encodeURIComponent(stringified)}`
		})
		.join('&')
	return '?' + queryString
}
