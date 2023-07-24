export interface Cookie {
  /**@external the name of the cookie can be prefixed for security reasons with __Host- or __Secure- to enforce secure and domain locked cookies */
  name: string
  value: any
  /**@external don't specify when using __Host- prefix */
  domain?: string
  path?: string
  /**@default "Lax" @external Cookie.secure must be true in order to be set to "None" */
  sameSite?: "Strict" | "Lax" | "None"
  /**@default false */
  httpOnly?: boolean
  /**@default false @external can only be used on https connections */
  secure?: boolean
  /**@extends only specify one of expires - maxAge */
  expires?: Date
  maxAge?: Date
}

export function createCookie ( cookie: Cookie ) {
  verifyCookie( cookie )
  return cookie
}

export function stringifyCookie ( cookie: Cookie ) {
  verifyCookie( cookie )
  
  const { name, httpOnly, path, sameSite, value, domain, expires, maxAge, secure } = cookie
  
  const expiration = expires ? `Expires=${ expires }` : prefixDefined( "Max-Age=", maxAge )
  
  const strings = [
    encodeURIComponent(`${ name }=${ value }`),
    prefixDefined( "Domain=", domain ),
    prefixDefined( "Path=", path ),
    expiration,
    prefixDefined( "SameSite=", sameSite ),
    prefixDefined( "", secure && "Secure" ),
    prefixDefined( "", httpOnly && "httpOnly" ),
    prefixDefined( "", httpOnly && "httpOnly" ),
  ]
  
  return strings.filter( string => string ).join( "; " )
}

export function parseCookies (string: string) {
  return string.split(" ;").map( (cookie) => {
    const [name, value] = cookie.split("=").map(decodeURIComponent)
    return value ? [name, value] as const : [undefined, value] as const
  } )
}

function verifyCookie ( cookie: Cookie ) {
  if ( cookie.name.startsWith( "__Host-" ) ) {
    if ( !(
      ( cookie.secure ??= true ) === true &&
      !cookie.domain &&
      ( cookie.path ??= "/" ) === "/" )
    ) throw new Error( "__Host- cookies must be secure, not specify domain, path must be /" )
  }
  if ( cookie.name.startsWith( "__Secure-" ) ) {
    if ( ( cookie.secure ??= true ) === false )
      throw new Error( "__Secure- cookies must be secure" )
  }
}

function prefixDefined ( prefix: string, defined: any ) {
  if ( defined )
    return `${ prefix }${ defined }`
  return ""
}