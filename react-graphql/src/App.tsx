import { useState } from "react"
import PersonForm from "./components/PersonForm"
import Persons from "./components/Persons"
import { usePersons } from "./persons/usePersons"
import Notify from "./components/Notify"
import PhoneForm from "./components/PhoneForm"
import LoginForm from "./components/LoginForm"
import { useApolloClient } from "@apollo/client"

function App() {
  const { data, loading, error } = usePersons()
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null)
  const [ token, setToken ] = useState<string | null>(() => localStorage.getItem('phonenumbers-user-token'))
  const client = useApolloClient()

  if (error) return <span style={{ color: "red" }}>{error.message}</span>

  const notifyError = (message: string) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000);
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div className="App">
      <Notify errorMessage={errorMessage} />
      {loading 
        ? <p>Loading...</p>
        : <>
          <Persons persons={data?.allPersons} />
          {token ? (
            <button onClick={logout}>Cerrar Sesión</button>
          ) : (
            <LoginForm notifyError={notifyError} setToken={setToken} />
          )}
          <PhoneForm notifyError={notifyError} />
          <PersonForm notifyError={notifyError} />
        </>
      }
    </div>
  )
}

export default App
