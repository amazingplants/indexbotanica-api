export function normalizeQuery(query: any) {
  if(!query) { return query }
  for(let key of Object.keys(query)) {
    if(['contains', 'startsWith', 'endsWith'].indexOf(key) > -1) {
      query['mode'] = 'insensitive'
    }
    if(typeof query[key] === 'object') {
      query[key] = normalizeQuery(query[key])
    } 
  }
  return query
}