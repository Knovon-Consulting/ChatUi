import axios from "axios";
import openai from "openai";
import { IncomingForm } from "formidable";
import ffmpeg from "fluent-ffmpeg";
import FormData from "form-data";
import fs from "fs";
import ffmpegPath from "ffmpeg-static";

export const config = {
    api: {
      bodyParser: false,
    },
  };

  ffmpeg.setFfmpegPath(ffmpegPath);

const parseFormData = async (req) => {
    console.log('inside from1 ')
    return new Promise((resolve, reject) => {
      const form = new IncomingForm();
      console.log('inside from2')
      form.parse(req, (err, fields, files) => {
        console.log('inside from3')
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });
  };
  

export default async function handler (req, res) {
  if (req.method === "POST") {
   console.log('hellow')
    const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    openai.apiKey = OPENAI_API_KEY;
    const  formData  = req.body;
    console.log('hellow1')
    console.log(openai.apiKey)
    const { files } = await parseFormData(req);
    console.log('hellow2')
    console.log('formData=================',files)

    const filePath = files.file[0].filepath; // It may be 'filepath' based on formidable version or setup
    console.log('filePath--------',filePath); // Log to see the structure
    if (!filePath) {
      return res.status(400).json({ error: "Uploaded file not found." });
    }

      // Use fluent-ffmpeg to process the uploaded file
      const outputFileName = "output.wav";
      const outputPath = `${__dirname}/${outputFileName}`;
      ffmpeg(filePath)
        .output(outputPath)
        .on("end", async () => {
          console.log("File converted successfully");
          // Create a FormData object and append the processed file
          const formData = new FormData();
          formData.append(
            "file",
            fs.createReadStream(outputPath),
            "output.wav"
          );
          formData.append("provide", "bhasini");



    // const newFormData = new FormData();
    // newFormData.append("file", files.file[0]);
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    try {
      console.log('\n formData------:', formData)
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_OPENAI_API_URL}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
          },
        }
      );
      res.status(200).json({ message: response.data });
    } catch (error) {
      console.error("Error handling ==============================", error);
      res.status(500).json({ error: "Internal Server Error" });
    }

})
.on("error", (err) => {
  console.error("ffmpeg error=======================:", err);
  res
    .status(500)
    .json({ success: false, error: "Error converting file" });
})
.run();

  } else {
    // Method not allowed
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}