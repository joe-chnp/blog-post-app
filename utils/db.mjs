import * as pg from "pg";
const { Pool } = pg.default;

const connectionPool = new Pool({
    connectionString:
    "postgresql://postgres:chnpostgres@localhost:5432/my-blog-app",
});

export default connectionPool;