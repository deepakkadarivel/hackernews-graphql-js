const express = require('express');
const bodyParser = require('body-parser');
const {graphqlExpress, graphiqlExpress} = require('apollo-server-express');
const {authenticate} = require('./authentication');
const buildDataloaders = require('./dataloaders');
const formatError = require('./formatError');

const schema = require('./schema');

const connectMongo = require('./mongo-connector');
const start = async () => {
    const mongo = await connectMongo();
    var app = express();

    const buildOptions = async (req, res) => {
        const user = await authenticate(req, mongo.Users);
        return {
            context: {
                dataloaders: buildDataloaders(mongo),
                mongo,
                user
            },
            formatError,
            schema,
        };
    };
    app.use('/graphql', bodyParser.json(), graphqlExpress(buildOptions));

    app.use('/graphiql', graphiqlExpress({
        endpointURL: '/graphql',
        passHeader: `'Authorization': 'bearer token-dpk@test.com'`,
    }));

    const PORT = 3030;
    app.listen(PORT, () => {
        console.log(`Hacker news Graphql server running at port ${PORT}`);
    });
};

start();