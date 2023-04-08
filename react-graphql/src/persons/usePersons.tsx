import { ALL_PERSONS } from "./graphql-queries"
import { useQuery } from "@apollo/client"

export const usePersons = () => {
    const result = useQuery(ALL_PERSONS)
    return result
  }