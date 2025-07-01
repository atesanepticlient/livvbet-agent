// lib/cloudinary.ts
export async function uploadToCloudinary(file: File): Promise<string> {
  const timestamp = Math.floor(Date.now() / 1000);

  // Get signature from your API route
  const signatureRes = await fetch("/api/sign-cloudinary", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ timestamp }),
  });

  const { payload } = await signatureRes.json();
  const { signature, cloud_name, api_key } = payload;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", api_key);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", "agent_verifications");

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await uploadRes.json();
  return data.secure_url;
}
