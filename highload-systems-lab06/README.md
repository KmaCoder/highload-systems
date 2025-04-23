## 1. Setup Config Servers

```
cd configsvr
docker compose up -d
```

Connect to mongo instance of the first config service container:
```
mongosh mongodb://localhost:10001
```

Init configsvr replica set:
```
rs.initiate({
  _id: "cfgrs",
  configsvr: true,
  members: [
    {_id: 0, host: "host.docker.internal:10001"},
    {_id: 1, host: "host.docker.internal:10002"},
    {_id: 2, host: "host.docker.internal:10003"}
  ]
})
```

## 2. Setup Shard Servers

Create containers:

```
docker compose -f shard_eu/docker-compose.yml up -d
docker compose -f shard_us/docker-compose.yml up -d
docker compose -f shard_default/docker-compose.yml up -d
```

For each shard primary container (eu: 20001; us: 20011; default: 20021) connect to mongo instance with `mongosh mongodb://localhost:{PORT}` and init replica sets:

#### shard_eu_rs init

`mongosh mongodb://localhost:20001`

```
rs.initiate(
  {
    _id: "shard_eu_rs",
    members: [
      { _id : 0, host : "host.docker.internal:20001" },
      { _id : 1, host : "host.docker.internal:20002" },
      { _id : 2, host : "host.docker.internal:20003" }
    ]
  }
)
```

#### shard_us_rs init

`mongosh mongodb://localhost:20011`

```
rs.initiate(
  {
    _id: "shard_us_rs",
    members: [
      { _id : 0, host : "host.docker.internal:20011" },
      { _id : 1, host : "host.docker.internal:20012" },
      { _id : 2, host : "host.docker.internal:20013" }
    ]
  }
)
```

#### shard_default_rs init

`mongosh mongodb://localhost:20021`

```
rs.initiate(
  {
    _id: "shard_default_rs",
    members: [
      { _id : 0, host : "host.docker.internal:20021" },
      { _id : 1, host : "host.docker.internal:20022" },
      { _id : 2, host : "host.docker.internal:20023" }
    ]
  }
)
```

## 3. Setup Mongo Router

```
cd mongos
docker compose up -d
```

Connect to mongo instance of the first config service container:
```
mongosh mongodb://localhost:30000
```

Add shards to the cluster:
```
sh.addShard("shard_eu_rs/host.docker.internal:20001,host.docker.internal:20002,host.docker.internal:20003")

sh.addShard("shard_us_rs/host.docker.internal:20011,host.docker.internal:20012,host.docker.internal:20013")

sh.addShard("shard_default_rs/host.docker.internal:20021,host.docker.internal:20022,host.docker.internal:20023")
```

## 4. Enable sharding

Connect to the mongo cluster
```
mongosh mongodb://localhost:30000
```

Create database and enable sharding:
```
use mydb;
sh.enableSharding("mydb");
db.users.createIndex({ country: 1, _id: "hashed" });
sh.shardCollection("mydb.users", { country: 1, _id: "hashed" });
```

Check sharding status with 
```
sh.status()
```

## 5. Configure sharding zones (US, EU, Default)

```
mongosh mongodb://localhost:30000
```

```
sh.addShardTag("shard_us_rs", "us_zone");
sh.addShardTag("shard_eu_rs", "eu_zone");
sh.addShardTag("shard_default_rs", "default_zone");

const us = ["us"];
const eu = ["de","fr","it","es","pl"];
const default = ["ua"]

us.forEach(country => {
  sh.addTagRange("mydb.users",
    { country: country, _id: MinKey },
    { country: country, _id: MaxKey },
    "us_zone"
  );
});

eu.forEach(country => {
  sh.addTagRange("mydb.users",
    { country: country, _id: MinKey },
    { country: country, _id: MaxKey },
    "eu_zone"
  );
});

other.forEach(country => {
  sh.addTagRange("mydb.users",
    { country: country, _id: MinKey },
    { country: country, _id: MaxKey },
    "default_zone"
  );
});
```
