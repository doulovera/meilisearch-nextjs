# Install
First, download the content from https://install.meilisearch.com. You can use cURL for this. Then, execute the file.
```bash
curl -L https://install.meilisearch.com | sh 

./meilisearch
```

In case you need to configure an API Key (we will get to that later), you need to write the master key together with the code execution:
```bash
./meilisearch --master-key="xyz"
```

# Add content
In this example, we will add a JSON of movies from this link.
Download that file and, with the server started, make this request in the folder where you have the movies.json file (in the terminal, in Postman is different):
```bash
curl \
  -X POST 'http://127.0.0.1:7700/indexes/movies/documents' \
  -H 'Content-Type: application/json' \
  --data-binary @movies.json
```

The operations in Meilisearch are asynchronous, so if you can see if the request was successful, use this:
```bash
curl \
  -X GET 'http://localhost:7700/indexes/movies/tasks/0'
```

If the key “status” says “succeeded”, everything is good 👍.

Now, go to http://localhost:7700 and there will be content (will ask for the master key)

# Search
In our case, we will be using React/Next.js for the app. The docs and some tutorials recommend using the library `react-instantsearch-dom`. I couldn’t make work the SearchBox component, so we will be doing it differently this time.

First, we need an API key.

## Generating API Key
For this, I will be using Postman. First, in the Authorization tab, select the Bearer Token option and add the master key you used when starting the Meilisearch server. Now, make the request on:
```POST - http://localhost:7700/keys```

The request of the body may be different, depending on what you want to use it for. In this case, will be just for searching any index:
```json
{
    "description": "Testing purposes",
    "actions": ["search"],
    "indexes": ["*"],
    "expiresAt": "2022-04-30T00:00:00Z"
}
```

This will return some things and the key that you need.

# Run the project
Change the API Key and run this:
```bash
yarn add

yarn dev
```
