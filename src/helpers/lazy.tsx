import React, { Suspense, lazy as _lazy } from 'react'

const lazy = (componentFn, importPath) => {
    const LazyMod = _lazy(componentFn)
    LazyMod._importPath = importPath
    const mod = props => (
        <Suspense fallback={null}>
            <LazyMod {...props} />
        </Suspense>
    )
    mod._lazyMod = LazyMod
    return mod
}

export default lazy
