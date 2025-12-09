import dotenv from "dotenv";
dotenv.config();
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "https://btfs-review-app.vercel.app/",
    "https://another-frontend.com"
];

export default async function handler(req, res) {
    // Allow requests from your frontend
    const origin = req.headers.origin;

    if (allowedOrigins.includes(origin)) {
        res.setHeader("Access-Control-Allow-Origin", origin);
    }
    res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== "POST") return res.status(405).end();

    const { to, subject, html, text } = req.body;
    try {
        const response = await resend.emails.send({
            from: "Ogden@boxtruckfs.com",
            to,
            subject,
            html,
            text,
        });

        console.log("Resend response:", response);

        res.status(200).json({
            success: true,
            id: response?.data?.id || null,
            message: "Email sent successfully"
        });

    } catch (err) {
        console.error("Resend error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
}
