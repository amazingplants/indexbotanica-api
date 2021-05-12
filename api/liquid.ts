import { Liquid } from 'liquidjs'
const engine = new Liquid()

engine.registerFilter('pad', (v, length) => v.toString().padStart(typeof length === "number" ? length : 4, "0"))

export default engine
