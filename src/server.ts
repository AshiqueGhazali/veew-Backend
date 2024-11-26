
// import app from "./framework/config/app";
// import { connectToDatabase } from "./framework/config/sequelize";
// import "./jobs/croneJob";

// const PORT = process.env.PORT || 3000;

// connectToDatabase()
//   .then(() => {
//     app.listen(PORT, () => {
//       console.log(`Server running on http://localhost:${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error(
//       "Failed to start the server due to database connection error:",
//       err
//     );
//   });


import app from "./framework/config/app";
import { connectToDatabase } from "./framework/config/sequelize";
import "./jobs/croneJob";
import socketConnection from "./framework/config/socket";
import { createServer } from "http";

const PORT = process.env.PORT || 3000;

const server = createServer(app);

connectToDatabase()
  .then(() => {
    socketConnection(server);

    server.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start the server due to database connection error:",
      err
    );
  });
