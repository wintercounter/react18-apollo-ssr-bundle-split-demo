import './cache'

import path from 'path'
import fs from 'fs'

import express from 'express'
import bodyParser from 'body-parser'
import React from 'react'
import { getMarkupFromTree } from '@apollo/client/react/ssr'
import { fetch } from 'undici'
import compression from 'compression'

import App from '@/core/App'
import { createApolloClient } from '@/core/Apollo'

const PORT = process.env.PORT || 8080
const app = express()
const router = express.Router()

const getDataFromTree = (tree, context = undefined) => {
    return getMarkupFromTree({
        tree,
        context,
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        renderFunction: require('react-dom/server').renderToString
    })
}

app.use(compression())
router.use('/static', express.static(path.resolve(__dirname, '../..', 'build'), { maxAge: '30d' }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

const serverRenderer = async (req, res) => {
    // eslint-disable-next-line complexity,max-statements
    fs.readFile(path.resolve(__dirname, '../../build/index.html'), 'utf8', async (err, data) => {
        if (err) {
            console.error(err)
            return res.status(500).send('An error occurred')
        }

        const apolloClient = createApolloClient({
            httpLinkOptions: {
                fetch,
                uri: `https://countries.trevorblades.com/`
            }
        })

        const ToRender = () => {
            return <App apolloClient={apolloClient} />
        }

        let html
        try {
            html = await getDataFromTree(<ToRender />)
        } catch (error) {
            console.log(500, `${req.protocol}://${req.hostname}${req.originalUrl}`)
            console.log(error)
            res.status(500).send('Error processing request, try to <a href="/">return to the homepage</a>.')
            return
        }

        const initialState = apolloClient.extract()
        const results = data
            .replace('<div id="root"></div>', `<div id="root">${html}</div>`)
            .replace(
                '</body>',
                `</body><script>window.__APOLLO_STATE__=${JSON.stringify(initialState).replace(
                    /</g,
                    '\\u003c'
                )}</script>`
            )

        res.send(results)
    })
}

router.use('*', serverRenderer)

// tell the app to use the above rules
app.use(router)

app.listen(PORT, () => {
    console.log(`SSR running on port ${PORT}`)
})
