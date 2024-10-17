import app from "./framework/config/app";
import { connectToDatabase } from "./framework/config/sequelize";
import "./jobs/croneJob";

const PORT = process.env.PORT || 3000;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(
      "Failed to start the server due to database connection error:",
      err
    );
  });
