import { gql, useLazyQuery } from "@apollo/client"

const FIND_PERSON = gql`
  query findPersonByName($nameToSearch: String!) {
    findPerson(name: $nameToSearch) {
      name
      phone
      id
      address {
        stret
        city
      }
    }
  }
`

const FindPerson = () => {

    const [getPerson, result] = useLazyQuery(FIND_PERSON)

  return (
    <div>
      
    </div>
  )
}

export default FindPerson
