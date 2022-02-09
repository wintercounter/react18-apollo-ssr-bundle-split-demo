import React from 'react'
import { hydrateRoot } from 'react-dom'

import { createApolloClient } from '@/core/Apollo'
import App from '@/core/App'

const ApolloClient = createApolloClient({
    httpLinkOptions: {
        uri: `https://countries.trevorblades.com/`
    }
})

hydrateRoot(document.getElementById('root'), <App apolloClient={ApolloClient} />)
