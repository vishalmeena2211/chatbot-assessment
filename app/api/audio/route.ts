import { ElevenLabsClient } from "elevenlabs";
import { createWriteStream, createReadStream } from "fs";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

const client = new ElevenLabsClient({
    apiKey: process.env.ELEVENLABS_API_KEY,
});

export const createAudioFileFromText = async (
    text: string
): Promise<string> => {
    return new Promise<string>(async (resolve, reject) => {
        try {
            const audio = await client.generate({
                voice: "Rachel",
                model_id: "eleven_turbo_v2",
                text,
            });
            const fileName = join('/tmp', 'input.mp3');
            const fileStream = createWriteStream(fileName);

            audio.pipe(fileStream);
            fileStream.on("finish", () => resolve(fileName));
            fileStream.on("error", reject);
        } catch (error) {
            reject(error);
        }
    });
};

export async function POST(req: NextRequest) {
    try {
        const buffer = await req.arrayBuffer();

        const run = async (model: string, input: ArrayBuffer) => {
            try {
                const response = await fetch(
                    `https://api.cloudflare.com/client/v4/accounts/da3d30e2ee3bf3d26fab7fdc76a369ca/ai/run/${model}`,
                    {
                        headers: {
                            Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
                            "Content-Type": "application/octet-stream"
                        },
                        method: "POST",
                        body: input,
                    }
                );

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                return result;
            } catch (error) {
                console.error("Error in run function:", error);
                throw error;
            }
        };

        const response = await run("@cf/openai/whisper", buffer);
        const { text } = response.result;

        console.log("Text from Voice is :", text);

        // Create audio file from text and get the filename
        const audioFileName = await createAudioFileFromText(text);

        // Read the generated audio file and send it as a response
        const audioFileStream = createReadStream(audioFileName);

        return new NextResponse(audioFileStream, {
            headers: {
                'Content-Type': 'audio/mpeg', // Set the correct content type for MP3
                'Content-Disposition': `attachment; filename="${audioFileName}"`, // Suggest a filename for download
            },
        });
    } catch (error) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}