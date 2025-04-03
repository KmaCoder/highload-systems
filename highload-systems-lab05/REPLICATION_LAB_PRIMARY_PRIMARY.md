# PostgreSQL Primary-Primary Replication Lab

This lab demonstrates setting up bi-directional replication between two PostgreSQL instances, allowing writes to both servers.

## Overview

The setup consists of:
- Two PostgreSQL instances configured as primary servers
- HAProxy for load balancing between the primaries
- Logical replication for bi-directional data synchronization

## Components

1. **postgres-primary1**: First PostgreSQL primary server
2. **postgres-primary2**: Second PostgreSQL primary server
3. **haproxy-primary-primary**: Load balancer for distributing write operations

## Architecture

```
                       ┌───────────────┐
                       │    HAProxy    │
                       │ Load Balancer │
                       └───────┬───────┘
                               │
               ┌───────────────┴───────────────┐
               │                               │
               ▼                               ▼
    ┌─────────────────────┐       ┌─────────────────────┐
    │   postgres-primary1 │◄──────►│   postgres-primary2 │
    │      (Primary)      │       │      (Primary)      │
    └─────────────────────┘       └─────────────────────┘
               ▲                               ▲
               │                               │
               └───────────────────────────────┘
                   Bi-directional Replication
```

## Replication Implementation

This setup uses PostgreSQL's built-in logical replication with publications and subscriptions:

- Each primary server creates a publication for the `test_table`
- Each primary server subscribes to the publication from the other primary
- Changes on either primary are replicated to the other

## Ports

- **5442**: Direct access to postgres-primary1
- **5443**: Direct access to postgres-primary2
- **5020**: HAProxy load balancer (distributes writes to both primaries)
- **7020**: HAProxy statistics page

## Setup Instructions

1. Start the primary-primary setup:
   ```
   docker compose -f docker-compose-primary-primary.yml up -d
   ```

2. Wait for both servers to initialize, then run the replication setup script:
   ```
   ./setup-replication.sh
   ```

3. Test the replication by inserting data into each primary server:

   Insert into primary1:
   ```
   PGPASSWORD=postgres psql -h localhost -p 5442 -U postgres -d postgres -c "INSERT INTO test_table (name) VALUES ('test1');"
   ```

   Insert into primary2:
   ```
   PGPASSWORD=postgres psql -h localhost -p 5443 -U postgres -d postgres -c "INSERT INTO test_table (name) VALUES ('test2');"
   ```

4. Verify data was replicated to both servers:
   ```
   PGPASSWORD=postgres psql -h localhost -p 5442 -U postgres -d postgres -c "SELECT * FROM test_table;"
   PGPASSWORD=postgres psql -h localhost -p 5443 -U postgres -d postgres -c "SELECT * FROM test_table;"
   ```

5. Test the load balancer by inserting through HAProxy:
   ```
   PGPASSWORD=postgres psql -h localhost -p 5020 -U postgres -d postgres -c "INSERT INTO test_table (name) VALUES ('via-loadbalancer');"
   ```

## Potential Issues and Considerations

1. **Conflict Resolution**: This setup doesn't include automatic conflict resolution if the same row is updated on both primaries simultaneously.

2. **Sequence Gaps**: When using SERIAL or identity columns, you might see gaps in sequence values.

3. **Transaction Isolation**: Transactions spanning both primaries are not atomic.

4. **Failover**: This setup doesn't include automatic failover; if one primary goes down, you need to manually redirect traffic.

## Shutting Down

```
docker-compose -f docker-compose-primary-primary.yml down -v
``` 