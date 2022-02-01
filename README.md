# HID Explorer

There are three components involved in running the HID Explorer:

1. HID-Network (https://github.com/hypersign-protocol/hid-node)
2. Postgres
3. BDJuno
4. GraphQL

## Postgres Setup

Postgres stores the hid-node's block information, and acts as a cache for the explorer.

The docker setup is being done through Docker which is explained in the later section (Hasura Setup). Following is the link to the `sql` queries that needs to be run: https://github.com/forbole/bdjuno/tree/cosmos/v0.44.x/database/schema

Keep this handy for now, as it will be run later in Hasura setup section. And this has to be done once, in order to create the required tables.

For local setup, it is recommended to have pgAdmin installed for executing queries. (Link to download: https://www.pgadmin.org/download/pgadmin-4-apt/)

Config for pgAdmin:

```yml
Host name: <Will depend on the IP address of Postgress docker container. Have to re-edit this field every time the container is run>
Port: 5432
Database: postgres
Username: postgres
Password: postgresspassword
```

## BDJuno

It is a background service which keeps listening to these transactions from the hid-node, and keeps pushing into the Postgres Database.
Link to setup: https://docs.bigdipper.live/cosmos-based/parser/setup

Config used:

```yml
chain:
    bech32_prefix: cosmos
    modules: 
        - modules
        - messages
        - auth
node:
    type: remote
    config:
        rpc:
            client_name: hidnode
            address: http://localhost:26657
            max_connections: 20
        grpc:
            address: http://localhost:9095
            insecure: true
parsing:
    workers: 1
    listen_new_blocks: true
    parse_old_blocks: true
    parse_genesis: true
    start_height: 1
    fast_sync: true
    genesis_file_path: /home/arnab/.hid-node/config/genesis.json
database:
    name: postgres
    host: <Depends on the Postgres's Docker Container IP address>
    port: 5432
    user: postgres
    password: postgrespassword
    schema: public
    max_open_connections: 10
    max_idle_connections: 10
logging:
    level: debug
    format: text
telemetry:
    port: 5000
pruning:
    keep_recent: 100
    keep_every: 500
    interval: 10
pricefeed:
    tokens:
        - name: Atom
          units:
            - denom: uatom
              exponent: 0
            - denom: atom
              exponent: 6
              price_id: cosmos
distribution:
    rewards_frequency: 100

```

## Hasura

Hasura is a GraphQL engine, which provides GraphQL endpoints over the Postgres Database, and the data is sent to the frontend.

Follow this link to only download the `docker-compose.yml` file: https://hasura.io/docs/latest/graphql/core/getting-started/docker-simple.html

Start the docker containers using the following command (in the directory where the `docker-compose.yml` file is present)

```sh
$ sudo docker-compose up -d
```

Run the following to get the details of the containers:

```sh
$ sudo docker ps
```

Now, get the IP address of each of the containers:

```sh
$ sudo docker inspect <container-id> | grep "IP"
```

Now, take the Postgres's container's IP address and edit the config file of BDJuno and the PgAdmin config.

Coming to PgAdmin, once the connection is established, run the queries one by one.

## Running the UI

Node Version:  `v16.13.2`
NPM Version: `8.1.2`

To run the UI, run the following the command:

```sh
$ cd hid-explorer
$ npm i
$ cp .env.sample .env
$ npm run dev
```