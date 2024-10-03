async function run(model, input) {
    try {
        const response = await fetch(
            `https://api.cloudflare.com/client/v4/accounts/da3d30e2ee3bf3d26fab7fdc76a369ca/ai/run/${model}`,
            {
                headers: { 
                    Authorization: "Bearer a9XtZAH1c41k5FThmMCgabivngb4_Uhz3OFc8nwU",
                    "Content-Type": "application/octet-stream" // Set content type for binary data
                },
                method: "POST",
                body: input, // Send the raw audio buffer directly
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Error in run function:", error);
    }
}

const start = async () => {
    try {
        const audioResponse = await fetch(
            'https://github.com/Azure-Samples/cognitive-services-speech-sdk/raw/master/samples/cpp/windows/console/samples/enrollment_audio_katie.wav'
        );

        if (!audioResponse.ok) {
            throw new Error(`Audio fetch error! status: ${audioResponse.status}`);
        }

        const audioBuffer = await audioResponse.arrayBuffer(); // Get raw audio buffer

        run("@cf/openai/whisper", audioBuffer).then((response) => {
            console.log("Response:", response.result.text); // Log the actual response
        });

    } catch (error) {
        console.error("Error in start function:", error);
    }
}

start();