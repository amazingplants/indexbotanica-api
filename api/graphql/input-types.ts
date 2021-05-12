import { inputObjectType } from 'nexus'

export const StringComparisonInputType = inputObjectType({
  name: 'StringComparisonInputType',
  definition(t) {
    t.string('equals')
    t.string('not')
    t.string('contains')
    t.string('startsWith')
    t.string('endsWith')
  },
})

export const IntComparisonInputType = inputObjectType({
  name: 'IntComparisonInputType',
  definition(t) {
    t.int('equals')
    t.int('not')
    t.int('gt')
    t.int('lt')
  },
})

export const FloatComparisonInputType = inputObjectType({
  name: 'FloatComparisonInputType',
  definition(t) {
    t.float('equals')
    t.float('greaterThan')
    t.float('lessThan')
  },
})

