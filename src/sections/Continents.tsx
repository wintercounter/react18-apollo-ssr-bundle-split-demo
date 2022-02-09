import React from 'react'
import { useQuery, gql } from '@apollo/client'

const Continents = () => {
    const { data, loading } = useQuery(gql`
        query {
            continents {
                name
            }
        }
    `)

    if (loading) return null

    return (
        <ul>
            {data.continents.map(({ name }) => (
                <li key={name}>{name}</li>
            ))}
        </ul>
    )
}

export default Continents
