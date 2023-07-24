import { Duplex, Readable } from "stream"
import { ReadableStream, TransformStream } from "stream/web"
import { Cookie } from "../cookie"

export type ResponseType = "json" | "text" | "file" | "redirect" | "XML" | "resource" | "multipart" | "chunked" | "template" | "raw" | "stream" | "meta" | "events"

export interface Response<T extends ResponseType> {
  status: number
  mimeType: string
  headers: Headers | HeadersInit
  cookies: Cookie[]
  type: T
}

export interface Meta extends Response<"meta"> {
  mimeType: ""
}

export interface Json<T extends Record<string, any> | string | ArrayBuffer> extends Response<"json"> {
  mimeType: "application/json"
  body: T
}

export interface Text<T extends string | ArrayBuffer> extends Response<"text"> {
  mimeType: `text/${ string }`
  body: T
}

export interface Xml<T extends Record<string, any>, B> extends Response<"XML"> {
  schema: T
  mimeType: `application/xml`
  body: B
}

export interface Template<T extends Record<string, any>, O> extends Response<"template"> {
  path: string
  data: T
  options?: O
}

export interface Raw extends Response<"raw"> {
  mimeType: "application/octet-stream"
  body: Buffer | ArrayBuffer
}

export interface Multipart extends Response<"multipart"> {
  mimeType: "multipart/from-data"
  body: [],
}

export type compression = ""
export interface File extends Response<"file"> {
  path: string
  compression?: compression
}

export interface OnlineResource extends Response<"resource"> {
  path: string
  options?: RequestInit
}
export interface Redirect extends Response<"redirect"> {
  path: string
}
export interface Chunked extends Response<"chunked"> {
  handle: ReadableStream | Readable | TransformStream | Duplex
}
export interface Stream extends Response<"stream"> {
  handle: ReadableStream | Readable | TransformStream | Duplex
}
type sse<E, D> = { event: E, data: D, id?: string | number }
export interface Events<E, D> extends Response<"events"> {
  mimeType: "text/event-stream"
  handle: AsyncGenerator<sse<E,D>,sse<E,D>>
}

export type AnyResponse = Meta | Json<any> | Text<any> | Xml<any, any> | Template<any, any> | Raw | Multipart | File | OnlineResource | Redirect | Chunked | Stream | Events<any, any>