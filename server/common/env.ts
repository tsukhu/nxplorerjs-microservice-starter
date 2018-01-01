import * as dotenv from 'dotenv';
// Load environment based on profile
dotenv.config({ path: `.${process.env.NODE_ENV}.env` });

