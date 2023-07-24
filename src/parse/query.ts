import { addNestedValue, obj } from "../utils/nested-objects"
const splitter = /\]\[|\[|\]/g
const lookbehind = /(?<!\\)(\]\[|\[|\])/g

export default function query ( query: string ) {
    if ( !query ) return {}
    const string = query.trim()
    const peers = string.split( "&" )
    return peers.reduce( mapKeys, {} )
}

function mapKeys ( result: obj<string>, keyValue: string ) {
    const [ key, value ] = keyValue.split( "=" ).map( decodeURIComponent )
    const path = key.split( splitter )
    const isNested = path.length > 1

    if ( !path.at( 0 ) || ( isNested && !path.at( -1 ) && path.slice( 0, -1 ).every( s => !!s ) ) ) {
        return result
    }
    if ( !isNested ) {
        return addNestedValue(result, path, value)
    }
    return addNestedValue( result, path.slice( 0, -1 ), value )
}
