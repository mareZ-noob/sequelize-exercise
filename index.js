const express = require("express");
const app = express();
const port = 3000;
const expresshbs = require("express-handlebars");
const { createPagination } = require("express-handlebars-paginate");

app.use(express.static(__dirname + "/html"));

app.engine(
    "hbs", 
    expresshbs.engine({
        extname: "hbs",
        defaultLayout: "layout",
        layoutsDir: __dirname + "/views/layouts",
        partialsDir: __dirname + "/views/partials",
        runtimeOptions: {
            allowProtoPropertiesByDefault: true,
        },
        helpers: {
            createPagination,
            formatDate: (date) => {
                return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                });
            },
        }
    })
);

app.set("view engine", "hbs");
app.get("/", (req, res) => {
    res.redirect("/blogs");
});

app.use("/blogs", require("./routes/blogRouter"));

// app.get("/details", (req, res) => {
//     res.render(
//         "details"
//     );
// });


app.listen(port, () => {
    console.log(`Server is running on localhost:${port}`);
});