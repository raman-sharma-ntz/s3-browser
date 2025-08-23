import express from "express";
import session from "express-session";
import expressEjsLayouts from "express-ejs-layouts";
import bodyParser from "body-parser";
import helmet from "helmet";
import csrf from "csurf";
import path from "path";
import routes from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(process.cwd(), "src/static")));

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));
app.use(expressEjsLayouts);

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

const csrfProtection = csrf();
app.use(csrfProtection);

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
