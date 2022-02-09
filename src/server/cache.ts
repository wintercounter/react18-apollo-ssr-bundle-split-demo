import * as sections from '@/sections'

Object.entries(sections).forEach(m => {
    const [name, { _lazyMod: mod }] = m
    if (!mod || !mod._importPath) {
        console.log('Error, no _importPath for module', name)
        return
    }
    mod._payload._status = 1
    mod._payload._result = require(mod._importPath)
})
