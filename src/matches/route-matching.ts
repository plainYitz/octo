export const alwaysMatch = [ "*", "...", ":" ]
const alias = ":"
const wildcard = "*"
const opening = "{",
  closing = "}"

const regexRegistry = new Map<string, RegExp>()

export function matcher (matchStrings: string[], path: string) {
  return matchStrings
    .map( (string) => matches(string, path) )
    .filter( ({matches}) => matches )
}

function matches ( string: string, to: string ) {

  if (string === to || alwaysMatch.includes(string) ) {
    return { matches: true, from: string, as: string, value: to }
  }

  const aliasIndex = string.indexOf( alias )
  const biggerIndex = Math.max( aliasIndex, string.indexOf( wildcard ) )
  const openingIndex = string.indexOf( opening )
  const closingIndex = string.lastIndexOf( closing )

  if ( biggerIndex === 0 ) {
    return { matches: true, from: string, as: string.slice( 1 ), value: to }
  }
  if ( Math.max( biggerIndex, openingIndex ) === -1 ) {
    return { matches: false, from: string, as: string, value: to }
  }

  if( openingIndex < closingIndex && openingIndex > -1 ) {
    const start = openingIndex
    const end = indexToOffsetEnd( string, closingIndex )
    end
    const trimmed = string.slice( start +1, end -1 )
    const value = to.slice( start, end || to.length )

    const matches = matchSubstring( string, to, start ) &&
      matchSubstring( string, to, end )

    if ( trimmed === alias ) {
      return { matches, from: string, as: "", value }
    }
    if ( aliasIndex === -1 ) {
      return { matches, from: string, as: trimmed, value }
    }

    const key = string.slice( start + 1, aliasIndex )
    const type = string.slice( aliasIndex + 1, end - 1 )
  
    if (!type) {
      return { matches, from: string, as: key, value: value }
    }

    const parsedValue = matchType( type, value )
    if (parsedValue){
      return { matches: matches, from: string, as: key, value: parsedValue }
    }
  }
  if (biggerIndex !== -1) {
    const start = string.slice(0, biggerIndex)
    const name = string.slice( biggerIndex + 1 )
    const value = to.slice( biggerIndex )

    const matches = start === to.slice(0, biggerIndex)

    return { matches, from: string, as: name, value }
  }
  
  return { matches: false, from: string, as: string, value: to }
}

function getAddRegex ( string: string ) {
  return regexRegistry.get( string ) ?? addRegex(string)
}

function addRegex ( string: string ): RegExp {
  const regexp = createRegex( string )
  regexRegistry.set( string, regexp )
  return regexp
}

function createRegex ( string: string ): RegExp {
  return RegExp( string )
}

function stringToBigint (string: string) {
  try {
    return BigInt(string)
  } catch {}
  return null
}

/**
 * @param index when `index` is positive it comperes the `starts`, when `index` is negative it comperes the `ends`
 */
function matchSubstring ( string: string, to: string, index: number ) {
  const start = Math.min( 0, index )
  const end = index > -1 ? Math.max( -1, index ) : undefined
  return string.slice( start, end ) === to.slice( start, end )
}



/**
 * @description convert's an `index` to a relative offset from the end, to be able to compare another string from the same relative position.
 */
function indexToOffsetEnd ( string: string, index: number ) {
  return -( string.length - 1 - index )
}

export function matchType ( type: string, string: string ) {
  switch ( type.toLowerCase() ) {
    case "string":
    case "":
      return string
    case "int":
      return parseInt( string ) <= Infinity ? parseInt( string ) : null
    case "float":
    case "number":
      return +string <= Infinity ? +string : null
    case "bigint":
    case "long":
      return stringToBigint(string)
    case "date":
      const date = new Date( string )
      return date.toString() !== "Invalid Date" ? date : null
    // case "uuid":
    default:
      return getAddRegex(type)?.test( string ) ? string : null
  }
}

export function isMatchString ( string: string ): boolean {
  const indexOpening = string.indexOf( "{" )

  return (
    ( indexOpening > -1 && indexOpening < string.indexOf( "}" ) ) ||
    alwaysMatch.some( ( m ) => {
      return string.includes( m )
    } )
  )
}