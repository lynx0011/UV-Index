import express from "express";
import axios from "axios";

const app = express();
const port = 3000;

const apiKey = "openuv-32jy8e6rm59pyx7n-io";
let data;

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));
app.use(express.json())

app.get("/", (req, res) => {
    res.render("index.ejs", { data: data})
    data = undefined
});

app.post("/submit", async (req, res) => {
    let location = req.body.loc;
    let latitude = parseInt(location.split(", ")[0], 10);
    let longitude = parseInt(location.split(", ")[1], 10);
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

        let uvIndex = Math.round(result.data.result.uv);

        if (uvIndex < 3) {
            data = {
                uv: uvIndex,
                res: "It's low. Sunscreen is not necessary, but it's always good to protect your skin."
            };

        } else if (uvIndex >= 3 && uvIndex <= 5) {
            data = {
                uv: uvIndex,
                res: "It's moderate. Consider using sunscreen if you'll be outside for extended periods."
            };

        } else if (uvIndex >= 6 && uvIndex <= 7) {
            data = {
                uv: uvIndex,
                res: "It's high. Use sunscreen and seek shade during midday hours."
            };

        } else if (uvIndex >= 8 && uvIndex <= 10) {
            data = {
                uv: uvIndex,
                res: "It's very high. Apply sunscreen, wear protective clothing, and avoid going out during peak hours."
            };

        } else if (uvIndex > 10) {
            data = {
                uv: uvIndex,
                res: "It's extreme! Use sunscreen, wear sunglasses, cover up, and stay indoors if possible."
            };

        }
        res.redirect("/")

    } catch (err) {
        console.error(err.message)
        if (err.response.status === 403) {
            data = {
                message: "Access denied. You do not have permission to perform this action."
            }
        } else {
            data = {
                message: "Error: Please enter a valid location and try again."
            }
        }
        res.render("index.ejs", { err: data})
        data = undefined
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})