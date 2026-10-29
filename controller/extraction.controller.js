import Extraction from '../model/extraction.model.js';
import { extractWithNvidia } from '../utils/ai.utils.js';

export const extractContent = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "File is required.."
            });
        }

        const base64 = req.file.buffer.toString("base64");
        const imageData = `data:${req.file.mimetype};base64,${base64}`;

        const prompt = `Analyze this image and extract visible information.
If it contains a resume, extract:
- Name
- Email
- Phone
- Skills
- Education
- Experience
- Projects
If it contains a LinkedIn recruitment post, extract:
- Recruiter email, if visible
- Recruiter or author name
- Company
- Job role
- Required skills
- Post content
Return valid JSON. Use null for missing information.
Do not invent or guess information.`;

        const extractContentWithAi = await extractWithNvidia(prompt, imageData);

        let parseData = null;
        try {
            const jsonMatch = extractContentWithAi.match(/\{[\s\S]*\}/);
            const toParse = jsonMatch ? jsonMatch[0] : extractContentWithAi;
            parseData = JSON.parse(toParse);
        } catch (error) {
            console.log("Error while parsing : ", error.message);
            parseData = { rawContent: extractContentWithAi };
        }

        const savedExtraction = await Extraction.create({
            data: parseData,
            rawContent: extractContentWithAi,
            createdBy: req.user._id
        });

        return res.status(200).json({
            success: true,
            msg: "Extraction Success...",
            savedExtraction
        });

    } catch (error) {
        console.error("Extraction Error: ", error.message);
        return res.status(500).json({
            success: false,
            msg: "Internal Server Error...",
            error: error.message
        });
    }
};
