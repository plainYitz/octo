import { STATUS_CODES } from "http"
import { Cookie } from "../cookie"
import type { Json, Meta, Text, Response, ResponseType, File, compression } from "./responses"

export default function Response<T extends ResponseType> ( response: Response<T> ) {
    return response
}

type metaOptions = {
    cookies?: Cookie[]
    headers?: HeadersInit
}
export function json<J extends string | ArrayBuffer | Record<string, any>> ( json: J, status = 200, options?: metaOptions ): Json<J> {
    return { cookies: options?.cookies ?? [], body: json, status, headers: options?.headers ?? {}, mimeType: "application/json", type: "json" }
}

type textOptions = metaOptions & { mimeType?: `text/${ string }` }
export function text<T extends string | ArrayBuffer | Buffer> ( text: T, status = 200, options?: textOptions ): Text<T> {
    return { cookies: options?.cookies ?? [], body: text, status, headers: options?.headers ?? {}, mimeType: options?.mimeType ?? "text/plain", type: "text" }
}
type fileOptions = metaOptions & { mimeType?: string, compression?: compression }
export function file ( path: string, status = 200, options?: fileOptions  ): File {
    return { cookies: options?.cookies ?? [], headers: options?.headers ?? {}, mimeType: options?.mimeType ?? "text/plain", path, compression: options?.compression, status, type: "file" }
}

export function meta( status = 200, options?: metaOptions ): Meta {
    return { cookies: options?.cookies ?? [], headers: options?.headers ?? [], mimeType: "", status, type: "meta" }
}
export function status( status = 200, options?: metaOptions ): Text<string> {
    return { cookies: options?.cookies ?? [], body: STATUS_CODES[status] || "", headers: options?.headers ?? [], mimeType: "text/plain", status, type: "text" }
}
export function defaultResponse (): Meta {
    return { cookies: [], status: 404, headers: [], mimeType: "", type: "meta" }
}