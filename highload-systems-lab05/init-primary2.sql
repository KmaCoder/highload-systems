-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS postgres_fdw;

-- Wait for a moment to ensure both servers are up
\! sleep 10

-- Create a foreign server connection to the other primary
CREATE SERVER primary1_server
    FOREIGN DATA WRAPPER postgres_fdw
    OPTIONS (host 'postgres-primary1', port '5432', dbname 'postgres');

-- Create user mapping for replication user
CREATE USER MAPPING FOR postgres
    SERVER primary1_server
    OPTIONS (user 'postgres', password 'postgres');

-- Create a publication for logical replication
CREATE PUBLICATION primary2_pub FOR ALL TABLES;

-- Set up subscription on primary2

-- \! sleep 10
-- CREATE SUBSCRIPTION primary2_sub
--     CONNECTION 'host=postgres-primary1 port=5432 dbname=postgres user=postgres password=123456'
--     PUBLICATION primary1_pub;
