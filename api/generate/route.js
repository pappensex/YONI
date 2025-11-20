export const config = { runtime: "edge" };

const MODEL = "black-forest-labs/flux-1.1-pro";
const DEFAULT_SCENE = "AnkhOfLove_Day";
const PENDING_STATES = new Set(["starting", "processing", "queued"]);
const JSON_HEADERS = { "Content-Type": "application/json" };

const PROMPTS = {
  AnkhOfLove_Day: `ultra-realistic cinematic portrait ... (Day version)`,
  AnkhOfLove_Night: `ultra-realistic moonlit scene ... (Night version)`,
  EnergyFusion_Black: `macro photograph of two hands ...`
};

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function handler(req) {
  if (req.method && req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
      status: 405,
      headers: JSON_HEADERS
    });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return new Response(JSON.stringify({ error: "Missing REPLICATE_API_TOKEN" }), {
      status: 500,
      headers: JSON_HEADERS
    });
  }

  let requestedScene = DEFAULT_SCENE;
  try {
    const body = await req.json();
    if (body?.scene && typeof body.scene === "string" && PROMPTS[body.scene]) {
      requestedScene = body.scene;
    }
  } catch (err) {
    // ignore malformed JSON and fall back to default scene
  }

  const payload = {
    input: {
      prompt: PROMPTS[requestedScene],
      width: requestedScene === "EnergyFusion_Black" ? 1024 : 1344,
      height: requestedScene === "EnergyFusion_Black" ? 1024 : 768,
      guidance: 4.5,
      num_inference_steps: 28,
      seed: 888
    }
  };

  const createResponse = await fetch(
    `https://api.replicate.com/v1/models/${MODEL}/predictions`,
    {
      method: "POST",
      headers: {
        Authorization: `Token ${process.env.REPLICATE_API_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  if (!createResponse.ok) {
    const errorText = await createResponse.text();
    return new Response(
      JSON.stringify({
        error: `Replicate request failed: ${createResponse.status}`,
        details: errorText
      }),
      { status: 502, headers: JSON_HEADERS }
    );
  }

  let prediction = await createResponse.json();
  const startTime = Date.now();
  const maxWaitMs = 60_000;

  while (PENDING_STATES.has(prediction.status)) {
    if (Date.now() - startTime > maxWaitMs) {
      return new Response(
        JSON.stringify({ error: "Timed out waiting for prediction" }),
        { status: 504, headers: JSON_HEADERS }
      );
    }

    await sleep(2000);

    const pollResponse = await fetch(
      `https://api.replicate.com/v1/predictions/${prediction.id}`,
      {
        headers: { Authorization: `Token ${process.env.REPLICATE_API_TOKEN}` }
      }
    );

    if (!pollResponse.ok) {
      const pollError = await pollResponse.text();
      return new Response(
        JSON.stringify({
          error: `Replicate poll failed: ${pollResponse.status}`,
          details: pollError
        }),
        { status: 502, headers: JSON_HEADERS }
      );
    }

    prediction = await pollResponse.json();
  }

  if (prediction.status !== "succeeded") {
    return new Response(
      JSON.stringify({
        status: prediction.status,
        error: prediction.error || "Prediction failed"
      }),
      { status: 500, headers: JSON_HEADERS }
    );
  }

  const output = Array.isArray(prediction.output)
    ? prediction.output.filter(Boolean)
    : prediction.output
      ? [prediction.output]
      : [];

  return new Response(
    JSON.stringify({
      id: prediction.id,
      status: prediction.status,
      output,
      scene: requestedScene,
      metrics: prediction.metrics || null
    }),
    { headers: JSON_HEADERS }
  );
}
