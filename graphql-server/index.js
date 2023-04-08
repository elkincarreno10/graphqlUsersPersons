import { ApolloServer, AuthenticationError, UserInputError, gql } from 'apollo-server'
import './config/db.js'
import Person from './models/Person.js'
import User from './models/User.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const typeDefinitions = gql`

    enum YesNo {
        YES
        NO
    }

    type Address {
        street: String!
        city: String!
    }

    type Person {
        name: String!
        phone: String
        address: Address!
        id: ID!
    }

    type User {
        username: String!
        friends: [Person]!
        id: ID!
    }

    type Token {
        value: String!
    }

    type Query {
        personCount: Int!
        allPersons(phone: YesNo): [Person]!
        findPerson(name: String!): Person
        me: User
    }

    type Mutation {
        addPerson(
            name: String!
            phone: String
            street: String!
            city: String!
        ): Person
        editNumber(
            name: String!
            phone: String!
        ): Person
        createUser(
            username: String!
        ): User
        login(
            username: String!
            password: String!
        ): Token
        addAsFriend(
            name: String!
        ): User
    }
`

const resolvers = {
    Query: {
        personCount: () => Person.collection.countDocuments(),
        allPersons: async (root, args) => {
            if(!args.phone) return Person.find({})
            return Person.find({ phone: { $exists: args.phone === 'YES' } })
        },
        findPerson: async (root, args) => {
            const { name } = args
            return await Person.findOne({ name })
        },
        me: (root, args, context) => {
            return context.currentUser
        }
    },
    Mutation: {
        addPerson: async (root, args, context) => {
            const { currentUser } = context
            if(!currentUser) throw new AuthenticationError('not authenticated')

            const person = new Person({ ...args })
            try {
                await person.save()
                currentUser.friends = currentUser.friends.concat(person)
                await currentUser.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return person
        },
        editNumber: async (root, args) => {
            const person = await Person.findOne({ name: args.name })
            if(!person) return

            person.phone = args.phone
            try {
                await person.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return person
        },
        createUser: async (root, args) => {
            const user = new User( { username: args.username } )
            try {
                await user.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args
                })
            }
            return user
        },
        login: async (root, args) => {
            const user = await User.findOne({ username: args.username })
            if(!user || args.password !== 'password') {
                throw new UserInputError('wrong credentials')
            }

            const userForToken = {
                username: user.username,
                id: user._id
            }

            return {
                value: jwt.sign(userForToken, process.env.JWT_SECRET)
            }
        },
        addAsFriend: async (root, args, context) => {
            const { currentUser } = context
            if(!currentUser) throw new AuthenticationError('not authenticated')

            const person = await Person.findOne( { name: args.name } )

            const nonFriendlyAlready = person => !currentUser.friends.map(p => p._id).includes(person._id)
            if(nonFriendlyAlready(person)) {
                currentUser.friends = currentUser.friends.concat(person)
                currentUser.save()
            }

            return currentUser
        }
    },
    Person: {
        address: (root) => {
            return {
                street: root.street,
                city: root.city
            }
        }
    }
}

const server = new ApolloServer({
    typeDefs: typeDefinitions,
    resolvers,
    context: async ({ req }) => {
        const auth = req ? req.headers.authorization : null
        if(auth && auth.toLowerCase().startsWith('bearer ')) {
            const token = auth.substring(7)
            const { id } = jwt.verify(token, process.env.JWT_SECRET)
            const currentUser = await User.findById(id).populate('friends')
            return { currentUser }
        }
    }
})

server.listen().then(({url}) => {
    console.log(`Server ready at ${url}`)
})