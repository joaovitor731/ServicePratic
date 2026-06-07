const {
  DATABASE_URL = 'mysql://servicepratic:password@localhost:3306/servicepratic',
} = process.env;

const databaseConfig = {
  url: DATABASE_URL,
};

export default databaseConfig;
