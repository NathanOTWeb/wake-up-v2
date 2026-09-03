import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'fec88023b7c34127161f0e151aba3bf1543a257b', queries,  });
export default client;
  