import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

let apiKey = "openuv-2pwvp3rm51xzja1-io";
let data;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.render("index.ejs", { object: data})
});

app.post("/submit", async (req, res) => {
    let latitude = req.body.latitude
    let longitude = req.body.longitude
    try {
        const result = await axios.get("https://api.openuv.io/api/v1/uv?", {
            params: {
                lat: latitude,
                lng: longitude
            },
            headers: {
                "x-access-token" : apiKey
            }
        });
        data =  {
            uvIndex: Math.round(result.data.result.uv),
            lat: latitude,
            lng: longitude
        };
        res.redirect("/");
    } catch (err) {
        console.error(err.message)
        res.render("index.ejs", { err: err.message})
    }
});

app.listen(port, () => {
    console.log("kadawfasdad.")
})