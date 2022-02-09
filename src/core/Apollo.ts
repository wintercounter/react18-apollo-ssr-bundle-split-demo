import { ApolloClient, ApolloLink, HttpLink, InMemoryCache } from '@apollo/client'
import { onError } from '@apollo/client/link/error'

const errorLink = onError(({ graphQLErrors, networkError, operation, response }) => {
    if (graphQLErrors)
        graphQLErrors.forEach(({ message, locations, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Path: ${path}, Locations:`, locations)
        )
    if (networkError) {
        console.log(`[Network error]: ${networkError}`)
        console.log('operation', JSON.stringify(operation, null, 2))
        console.log('response', response)
    }
})

/* eslint-disable-next-line */
export const createApolloClient = ({ httpLinkOptions }) => {
    return new ApolloClient({
        link: ApolloLink.from([errorLink, new HttpLink(httpLinkOptions)]),
        cache: new InMemoryCache().restore(typeof window !== 'undefined' ? window.__APOLLO_STATE__ : undefined)
    })
}
