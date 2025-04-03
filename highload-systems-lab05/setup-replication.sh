#!/bin/bash

# Set up subscription on primary1
echo "Setting up subscription on primary1..."
PGPASSWORD=postgres psql -h localhost -p 5442 -U postgres -d postgres -c "
CREATE SUBSCRIPTION primary1_sub
    CONNECTION 'host=postgres-primary2 port=5432 dbname=postgres user=postgres password=123456'
    PUBLICATION primary2_pub;
"

# Set up subscription on primary2
echo "Setting up subscription on primary2..."
PGPASSWORD=postgres psql -h localhost -p 5443 -U postgres -d postgres -c "
CREATE SUBSCRIPTION primary2_sub
    CONNECTION 'host=postgres-primary1 port=5432 dbname=postgres user=postgres password=123456'
    PUBLICATION primary1_pub;
"

echo "Bi-directional replication setup completed!"