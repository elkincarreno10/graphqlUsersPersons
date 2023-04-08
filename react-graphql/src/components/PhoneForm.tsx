import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { EDIT_NUMBER } from "../persons/graphql-mutations";


interface Notifier {
    notifyError: (message: string) => void;
}

const PhoneForm = ({notifyError}: Notifier) => {

    const [name, setName] = useState('')
    const [phone, setPhone] = useState('')

    const [ changeNumber, result ] = useMutation(EDIT_NUMBER)

    useEffect(() => {
        if(result.data && result.data.editNumber === null) {
            notifyError('Person not found')
        }
    }, [result.data])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        changeNumber({ variables: { name, phone } })

        setName('')
        setPhone('')
    }

  return (
    <div>
      <h2>Edit Phone Number</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Name" type="text" value={name} onChange={e => setName(e.target.value)} />
        <input placeholder="Phone" type="text" value={phone} onChange={e => setPhone(e.target.value)} />
        <button>Cahnge Phone</button>
      </form>
    </div>
  )
}

export default PhoneForm