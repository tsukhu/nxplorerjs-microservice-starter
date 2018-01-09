import * as dotenv from 'dotenv';
// Load environment based on profile
// Will check for .<NODE_ENV>.env file if not present
// it falls back on .env
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

