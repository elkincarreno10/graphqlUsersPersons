
import React, { useState, useEffect } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../login/graphql-queries"

interface PropsLogin {
    notifyError: (message: string) => void;
    setToken: React.Dispatch<React.SetStateAction<string | null>>
}

const LoginForm = ({notifyError, setToken}: PropsLogin) => {

    const [ username, setUsername ] = useState('')
    const [ password, setPassword ] = useState('')


    const [ login, result ] = useMutation(LOGIN, {
        onError: error => {
            notifyError(error.message)
        }
    })

    useEffect(() => {
        if(result.data) {
            const token = result.data.login.value
            setToken(token)
            localStorage.setItem('phonenumbers-user-token', token)
        }
    }, [result.data])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        login({ variables: { username, password }})
    }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
            username <input 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
            />
        </div>
        <div>
            password <input 
                type='password'
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            />
        </div>
        <button type='submit'>Login</button>
      </form>
    </div>
  )
}

export default LoginForm
