# Chunk visualizer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
and it basically connects to a hasura graphql api to visualize hypertable chunks of a [TimescaleDB](https://timescale.com)
instance.


Hypertables are an abstract table representation that empowers timeseries
storage for postgresql databases.

This is a simple way to preview chunks and here is how to make it happen:

```sql
CREATE OR replace VIEW chunks_with_compression AS
SELECT DISTINCT ch.chunk_name,
                ccs.chunk_schema,
                ch.hypertable_schema,
                ch.hypertable_name,
                ch.range_start,
                ch.range_end,
                COALESCE(ccs.before_compression_total_bytes, NULL, cds.total_bytes) AS before_compression_total_bytes,
                ccs.after_compression_total_bytes
FROM (
 SELECT hypertable_schema,
    hypertable_name,
    chunk_name,
    range_start,
    range_end
 FROM  timescaledb_information.chunks) AS ch
LEFT OUTER JOIN LATERAL chunk_compression_stats(ch.hypertable_name::regclass) ccs
ON              ch.chunk_name = ccs.chunk_name
LEFT OUTER JOIN LATERAL chunks_detailed_size(ch.hypertable_name::regclass) cds
ON              ccs.chunk_schema = cds.chunk_schema
AND             ch.chunk_name = cds.chunk_name;
```

With this query, you can get all details about chunk size and what limits they
cover in the data that is inside the database.


## Hasura types

Hasura needs to receive data from custom types that comes from table structures.

I couldn't find a simple way to wrap this without using a table, so, I'll easily
get the structure of the table calling the function with limit 0:

```sql
CREATE TABLE compressed_chunk AS
SELECT compress_chunk((c.chunk_schema ||'.' ||c.chunk_name)::regclass)
FROM   timescaledb_information.chunks c
WHERE  NOT c.is_compressed limit 0;
```

Now, we can return the "compressed_chunk" in our function:

```sql
CREATE OR REPLACE FUNCTION compress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT compress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  NOT c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

Same for decompression:

```sql
CREATE OR replace FUNCTION decompress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT decompress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

Now, the next step is jump into hasura API and connect into your database.

In the data panel, after setting up the postgresql URI of you database, you can
easily track each function as a query or mutation.

In our case, our view will be the query and we're going to use as a
subscription. The `decompress_chunk_named` and `compress_chunk_named` will be
tracked as GQL mutations.

## Setup application

Create a `.env` file with your hasura key:

```
REACT_APP_X_HASURA_ADMIN_SECRET=...
```

Install all dependencies before run the project:

```
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

