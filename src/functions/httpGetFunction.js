const { app } = require('@azure/functions');

app.http('httpget', {
    methods: ['GET'],
    authLevel: 'function',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const name = request.query.get('name') || 'world';

        return { body: `Hello, ${name}!` };
    }
});