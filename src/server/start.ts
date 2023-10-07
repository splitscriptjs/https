import http from 'http'
import { URL } from 'node:url'
import { EventEmitter } from '@splitscript.js/core'
import busboy from 'busboy'
import { Readable } from 'stream'
type Options = {
	port?: number
}

export default function start(options: Options = {}) {
	const emitter = new EventEmitter('http', '@splitscript.js/https', [
		'get',
		'post',
		'put',
		'patch',
		'delete',
		'head',
		'options',
		'connect',
		'trace',
		'get/**',
		'post/**',
		'put/**',
		'patch/**',
		'delete/**',
		'head/**',
		'options/**',
		'connect/**',
		'trace/**'
	])
	options.port ??= 3000

	const server = http.createServer((req, res) => {
		let body = ''
		req.on('data', (chunk) => {
			body += chunk.toString()
		})
		req.on('end', async () => {
			let bodyParsed: unknown
			if (req.headers['content-type'] === 'application/json') {
				try {
					bodyParsed = JSON.parse(body)
				} catch {
					bodyParsed = body
				}
			} else if (
				req.headers['content-type'] === 'application/x-www-form-urlencoded'
			) {
				try {
					bodyParsed = new URLSearchParams(body)
				} catch (e) {
					bodyParsed = e
				}
			} else if (req.headers['content-type'] === 'multipart/form-data') {
				try {
					const bb = busboy({ headers: req.headers })
					const formData: Record<string, unknown> = {}
					bb.on('field', (fieldname, val) => {
						formData[fieldname] = val
					})

					// Listen for file events from Busboy
					bb.on(
						'file',
						(
							fieldname: string,
							file: Readable,
							filename: string,
							encoding: string,
							mimetype: string
						): void => {
							const fileChunks: Buffer[] = []

							// Store file data in memory as a Buffer
							file.on('data', (data) => {
								fileChunks.push(data)
							})

							file.on('end', () => {
								const fileData = Buffer.concat(fileChunks)
								formData[fieldname] = {
									filename: filename,
									encoding: encoding,
									mimetype: mimetype,
									data: fileData // Store the file data in memory
								}
							})
						}
					)

					bb.on('finish', () => {
						bodyParsed = formData
					})
				} catch (e) {
					bodyParsed = body
				}
			}
			emitter.send([req.method?.toLowerCase() || 'get'], {
				req,
				res,
				body,
				bodyParsed
			})
			const parsed = new URL(
				req.url ?? '/',
				`http://${req.headers.host ?? '127.0.0.1'}`
			)

			const path = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/')
			emitter.send([req.method?.toLowerCase() || 'get', ...path], {
				req,
				res,
				body,
				bodyParsed
			})
			emitter.listeners().then((listeners) => {
				if (
					!listeners.find((v) => {
						if (v.event.length === 1) {
							return [
								'get',
								'post',
								'put',
								'patch',
								'delete',
								'head',
								'options',
								'connect',
								'trace'
							].includes(req.method?.toLowerCase() || 'get')
						} else {
							return (
								JSON.stringify([
									req.method?.toLowerCase() || 'get',
									...path
								]) === JSON.stringify(v)
							)
						}
					})
				) {
					res.statusCode = 404
					res.end()
				}
			})
		})
	})
	server.listen(options.port, () => {
		console.log(`online on ${options.port}`)
	})
}
