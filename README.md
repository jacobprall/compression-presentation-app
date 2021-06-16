# Chunk visualizer

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app)
and it basically connects to a [hasura](http://hasura.io) graphql api to visualize hypertable chunks of a [TimescaleDB](https://timescale.com) instance.


Hypertables are an abstract table representation that empowers timeseries storage for postgresql databases. The yellow circles represents the compressed data and the dark represents the uncompressed.

<img width="1250" alt="Screen Shot 2021-06-16 at 15 14 44" src="https://user-images.githubusercontent.com/15484/122271279-a0604c00-ceb5-11eb-8a3f-857645ec783d.png">


The idea here is collect this metadata from the "chunks" that are like subtables of the hypertables.

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

## A minimum hypertable example:

```sql
CREATE TABLE conditions (
      time TIMESTAMPTZ NOT NULL,
      device INTEGER NOT NULL,
      temperature FLOAT NOT NULL,
      PRIMARY KEY(time, device)
);
SELECT * FROM create_hypertable('conditions', 'time', 'device', 3);

INSERT INTO conditions
SELECT time, (random()*30)::int, random()*80 - 40
FROM generate_series(TIMESTAMP '2020-01-01 00:00:00',
                 TIMESTAMP '2020-01-01 00:00:00' + INTERVAL '1 month',
             INTERVAL '1 min') AS time;
-- INSERT 0 44641
```

If you want to keep adding more data in the sequence, try the following query:

```sql
INSERT INTO conditions WITH latest AS ( SELECT time FROM conditions ORDER BY time DESC LIMIT 1 )
SELECT generate_series(latest.time + INTERVAL '1 week', latest.time + INTERVAL '6 month', INTERVAL '1 min') AS time,
(random()*30)::int as device, random()*80 - 40 AS temperature from latest;
```

The insert will append new data with one week interval to guarantee we don't
touch any previous chunk but creates new ones. It keeps inserting ~ 40k records
per month.

### Testing the compression

Now it comes the cool part, let's add a compression policy to automatically use
the `device` column as our main segment.

```sql
ALTER TABLE conditions SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'device'
);
```

And then we can also set how many days after the record is inserted we want to
automatically compress:

```sql
SELECT add_compression_policy('conditions', INTERVAL '7 days');
```

So, it means that 7 days after the `time` of the insertion, it will compress the
data.

Checking old chunks that are good candidates to compress:

```sql
SELECT show_chunks('conditions', older_than => INTERVAL '3 days');
```

You can decompress manually a chunk with the following command:

```sql
SELECT decompress_chunk_named(chunk_name::varchar) 
FROM timescaledb_information.chunks WHERE is_compressed limit 1;
```

# Hasura Mutations

We want to have mutations for compress and decompress chunk. To accomplish that,
we need to take a look on how hasura types works.

## Hasura types

Hasura can use some custom types that comes from table structures.

I couldn't find a simple way to wrap this without using a table, so, I'll easily
get the structure of the table calling the function with limit 0:

## Compress chunk mutation


```sql
CREATE TABLE compressed_chunk AS
SELECT compress_chunk((c.chunk_schema ||'.' ||c.chunk_name)::regclass)
FROM   timescaledb_information.chunks c
WHERE  NOT c.is_compressed limit 0;
```

Hasura needs some function to be tracked as mutation. In this case, let's create the function to just rewrap the default `compress_chunk` from timescale extension. 

Now, we can return the "compressed_chunk" in our function that will compress the chunk:

```sql
CREATE OR REPLACE FUNCTION compress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT compress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  NOT c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

> Note that the function add an extra where clause to not compress what is already compressed.

## Decompress chunk mutation

We'll need a similar function for the decompression:

```sql
CREATE OR replace FUNCTION decompress_chunk_named(varchar) returns setof compressed_chunk AS $$
  SELECT decompress_chunk((c.chunk_schema ||'.' ||$1)::regclass)
  FROM   timescaledb_information.chunks c
  WHERE  c.is_compressed
  AND    c.chunk_name = $1 limit 1
$$ LANGUAGE SQL VOLATILE;
```

Now, the next step is jump into hasura cloud and connect the database as a new
data source.


In the data panel, after setting up the postgresql URI of you database, you can
easily track each function as a query or mutation. Here is an example of `compress_chunk_named` function:

<img width="617" alt="Screen Shot 2021-06-16 at 15 23 48" src="https://user-images.githubusercontent.com/15484/122272819-27fa8a80-ceb7-11eb-93de-ddf678acbc2a.png">


In our case, the subscription goes to the `chunks_with_compression` and here is what it looks like:

<img width="701" alt="Screen Shot 2021-06-16 at 15 25 20" src="https://user-images.githubusercontent.com/15484/122273065-6bed8f80-ceb7-11eb-8233-58d9fcccb2d1.png">


You should also track `decompress_chunk_named` and `compress_chunk_named` as GQL mutations with a single argument.

## Setup application

Create a `.env` file with your hasura key:

```bash
REACT_APP_X_HASURA_ADMIN_SECRET=...
```

Install all dependencies before run the project:

```bash
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

