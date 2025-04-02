# PostgreSQL High Availability with repmgr

This repository contains a Docker Compose configuration for setting up a high-availability PostgreSQL cluster using repmgr.

## Available Endpoints

- `GET /api/employees/:id/resume` - Get employee's resume by ID
- `GET /api/employees/:id/resume/hobbies` - Get employee's hobbies by ID
- `GET /api/employees/resume/hobbies/all` - Get all hobbies across employees
- `GET /api/employees/resume/cities/all` - Get all cities from work experiences
- `GET /api/employees/resume/hobbies/by-city?city=<city>` - Get hobbies by city
- `GET /api/employees/group-by-company?min-employees=<number>` - Group employees by company

## Architecture

The setup consists of:

1. **PostgreSQL Primary** - The main database server that accepts read and write operations
2. **PostgreSQL Replica** - A standby server that replicates data from the primary and can take over if the primary fails
3. **HAProxy** - Load balancer that routes client connections to the appropriate database server

## How it Works

- `repmgr` continuously monitors the health of the PostgreSQL servers
- If the primary server fails, `repmgr` will promote the replica to become the new primary
- `HAProxy` detects the change and directs traffic to the new primary

## Getting Started

### Prerequisites

- Docker and Docker Compose installed on your system

### Starting the Cluster

1. Set environment variables for PostgreSQL credentials (optional):

```bash
export POSTGRES_USERNAME=myuser
export POSTGRES_PASSWORD=mypassword
```

2. Start the cluster:

```bash
docker compose up -d
```

3. Check the status of the cluster:

```bash
docker compose ps
```

### Connecting to the Database

- For read-write operations, connect to HAProxy on port 5010
- For read-only operations, connect to HAProxy on port 5011

Example:

```bash
psql -h localhost -p 5010 -U postgres -d postgres
```

### Testing Failover

To simulate a failure of the primary node:

```bash
docker compose stop postgres-primary
```

The replica will be automatically promoted to become the new primary.

## Troubleshooting

### Checking Replication Status

To check the replication status:

```bash
docker compose exec postgres-primary repmgr -f /opt/bitnami/repmgr/conf/repmgr.conf cluster show
```

### Viewing Logs

```bash
docker compose logs postgres-primary
docker compose logs postgres-replica
docker compose logs haproxy
```
