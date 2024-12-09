import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();


const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());




app.post("/api/generate-image", async (req, res) => {
  const { prompt = "lizard on saturn" } = req.body; //default prompt with no form data

  const formData = new URLSearchParams();
  formData.append("prompt", prompt);
  formData.append("output_format", "webp");
  console.log("prompt:", prompt);

  console.log("MESSAGING REAGENT...")

  try {
    const response = await fetch(
      'https://noggin.rea.gent/peaceful-spoonbill-8088',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer rg_v1_mc66rqibqakaslgktuy89n5lfjhdygcwvfj2_ngk',
        },
        body: JSON.stringify({
          "prompt": "alligator on mars",
        }),
      }
    );

    const redirectUrl = response.url;
    console.log("Redirect URL from API:", redirectUrl);
    res.json({ imageUrl: redirectUrl });



  } catch (error) {
    console.error("Error in generate-image:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//   try {
//     const { prompt = "bunny on the moon" } = req.body;

//     const formData = new URLSearchParams();
//     formData.append("prompt", prompt);
//     formData.append("output_format", "webp");

//     const stabilityResponse = await axios.post(
//       "https://api.stability.ai/v2beta/stable-image/generate/core",
//       formData.toString(),
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.STABILITY_API_KEY}`, // API key from environment
//           "Content-Type": "application/x-www-form-urlencoded",
//           Accept: "image/*",
//         },
//         responseType: "arraybuffer",
//       }
//     );

//     if (stabilityResponse.status === 200) {
//       const base64Image = `data:image/webp;base64,${Buffer.from(
//         stabilityResponse.data
//       ).toString("base64")}`;

//       res.json({ image: base64Image });
//     } else {
//       res.status(stabilityResponse.status).json({
//         error: "Error generating image from Stability API",
//       });
//     }
//   } catch (error) {
//     console.error("Error in generate-image:", error);
//     res.status(500).json({ error: "Internal server error" });
//   }
// });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
