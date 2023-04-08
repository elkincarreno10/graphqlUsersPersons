import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import {ApolloClient, ApolloProvider, InMemoryCache, HttpLink } from '@apollo/client'

const getAuth = () => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return token ? `bearer ${token}` : ''
}

const client = new ApolloClient({
  link: new HttpLink({
    headers: {
      authorization: getAuth()
    },
    uri: import.meta.env.VITE_GRAPHQL_SERVER
  }),
  cache: new InMemoryCache()
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
)
