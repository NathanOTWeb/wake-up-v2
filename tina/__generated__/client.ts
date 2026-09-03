import { createClient } from "tinacms/dist/client";
import { queries } from "./types.js";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: '586d3d4d6159f60cd6e486d6442ff9ac9eb15d2c', queries,  });
export default client;
  