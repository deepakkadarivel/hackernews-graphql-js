const {makeExecutableSchema} = require('graphql-tools');
const resolvers = require('./resolvers');

const typeDefs = `
    type Link {
        id: ID!
        url: String!
        description: String!
        postedBy: User
        votes: [Vote!]!
    }
    
    type User {
        id: ID!
        name: String!
        email: String
        votes: [Vote!]!
    }
    
    type Vote {
        id: ID!
        user: User!
        link: Link!
    }
    
    type SigninPayload {
        token: String
        user: User
    }
    
    type LinkSubscriptionPayload {
      mutation: _ModelMutationType!
      node: Link
    }
    
    input AuthProviderSignupData {
        email: AUTH_PROVIDER_EMAIL
    }
    
    input AUTH_PROVIDER_EMAIL {
        email: String!
        password: String!
    }
    
    input LinkSubscriptionFilter {
      mutation_in: [_ModelMutationType!]
    }
    
    input LinkFilter {
      OR: [LinkFilter!]
      description_contains: String
      url_contains: String
    }
    
    enum _ModelMutationType {
      CREATED
      UPDATED
      DELETED
    }
    
    type Query {
        allLinks(filter: LinkFilter): [Link!]!
    }
    
    type Mutation {
        createLink(url: String!, description: String!): Link
        createUser(name: String!, authProvider: AuthProviderSignupData): User
        createVote(linkId: ID!): Vote
        deleteVote(linkId: ID!): Vote
        signinUser(email: AUTH_PROVIDER_EMAIL): SigninPayload!
        
    }
    
    type Subscription {
      Link(filter: LinkSubscriptionFilter): LinkSubscriptionPayload
    }
`;

module.exports = makeExecutableSchema({typeDefs, resolvers});