import type { IncomingMessage, ServerResponse } from 'http'

type Request = {
	req: IncomingMessage
	res: ServerResponse<IncomingMessage> & {
		req: IncomingMessage
	}
	body: string
	bodyParsed: unknown
}
export type Get = Request
export type Post = Request
export type Put = Request
export type Patch = Request
export type Delete = Request
export type Head = Request
export type Options = Request
export type Connect = Request
export type Trace = Request
export type GetXX = Request
export type PostXX = Request
export type PutXX = Request
export type PatchXX = Request
export type DeleteXX = Request
export type HeadXX = Request
export type OptionsXX = Request
export type ConnectXX = Request
export type TraceXX = Request
