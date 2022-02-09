import React from 'react'
import { ApolloProvider } from '@apollo/client/react'

import { Continents } from '@/sections'

const App = ({ apolloClient }) => {
    return (
        <ApolloProvider client={apolloClient}>
            <Continents />
        </ApolloProvider>
    )
}

export default App
