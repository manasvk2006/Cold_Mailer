import "dotenv/config";
import express from "express";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import fileRoutes from "./routes/file.routes.js";
import mailRoutes from "./routes/mail.routes.js";

const app = express();
const PORT = 5000;

app.use(express.json());

connectDB();
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/mail', mailRoutes);

app.get('/', (req, res) => {
    res.send("Cold_Mailer API is running");
});

app.listen(PORT, () => {
    console.log(`Server is Running on PORT : ${PORT}`);
});
