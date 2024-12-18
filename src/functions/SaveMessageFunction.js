const { app, output } = require('@azure/functions');

app.http('httpTriggerSaveMessage', {
    methods: ['POST'],
    authLevel: 'function',
    extraOutputs: [output.storageBlob({
        name: 'outputBlob',
        path: 'samples-workitems/{blobName}',
        connection: 'AzureWebJobsStorage_accountName'
    })],
    handler: async (request, context) => {
        context.log("HTTP trigger function processed a request.");

        let message;
        try {
            const body = await request.json();
            message = body.message || 'No message provided';
        } catch (error) {
            context.log("Error parsing body:", error.message);
            return {
                status: 400,
                body: JSON.stringify({ error: 'Invalid input', details: error.message })
            };
        }

        // Generate path with current timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const blobName = `${timestamp}.txt`;

        // Log the message content and output path
        context.log(`Message to be written to blob: ${message}`);
        context.log(`Blob name: ${blobName}`);

        // Set the output binding to the message content
        try {
            context.bindingData = context.bindingData || {};
            context.bindingData.outputBlob = {
                path: `samples-workitems/${blobName}`,
                data: message
            };

            context.log(`Blob written successfully at path: samples-workitems/${blobName}`);
        } catch (error) {
            context.log(`Error writing message to blob: ${error.message}`);
            return {
                status: 500,
                body: JSON.stringify({ error: 'Error writing message to blob', details: error.message })
            };
        }

        return {
            status: 200,
            body: JSON.stringify({ message: 'Message saved successfully!', details: message })
        };
    }
});