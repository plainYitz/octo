import { AnyResponse } from "./responses"

export default function join ( ...response: AnyResponse[] ): AnyResponse {
  return response.reduce( ( joined, response ) => {
    const { cookies, headers } = joined
    const joinedHeaders = joinHeaders( headers, response.headers )

    return { ...response, cookies: [ ...cookies, ...response.cookies,  ], headers: joinedHeaders }
  } )
}

function joinHeaders ( oldHeaders: HeadersInit, newHeaders: HeadersInit ) {
  const oldEntries = Array.isArray( oldHeaders )
    ? oldHeaders
    : oldHeaders instanceof Headers
      ? oldHeaders.entries()
      : Object.entries( oldHeaders )
  const newEntries = Array.isArray( newHeaders )
    ? newHeaders
    : newHeaders instanceof Headers
      ? newHeaders.entries()
      : Object.entries( newHeaders )

  return [ ...oldEntries, ...newEntries ]
}