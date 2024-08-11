import { ENV_VARIABLES } from "./configurations/env";

import dbConnect from "./utils/dbConnect";
import createServer from "./utils/server";

const app = createServer();

app.listen(ENV_VARIABLES.PORT, async () => {
  console.log(`Server started on PORT [${ENV_VARIABLES.PORT}]`);
  await dbConnect();
});