import axios from "axios";

// TODO: Put this in some sort of env variable /// not sure yet
const PASSWORDLESS_SERVER_BASE_URL = "http://localhost:3003";

export async function registerBegin(email: string) {
  const response = await axios.post(
    `${PASSWORDLESS_SERVER_BASE_URL}/api/attestation/begin`,
    {
      email,
    }
  );
  return response.data;
}

export async function registerComplete(email: string, credentials: object) {
  const response = await axios.post(
    `${PASSWORDLESS_SERVER_BASE_URL}/api/attestation/complete`,
    {
      credentials,
      email,
    }
  );
  return response.data;
}

export async function loginBegin(email: string) {
  const response = await axios.post(
    `${PASSWORDLESS_SERVER_BASE_URL}/api/assertion/begin`,
    { email }
  );
  return response.data;
}

export async function loginComplete(
  email: string,
  clientAssertionResponse: object
) {
  const response = await axios.post(
    `${PASSWORDLESS_SERVER_BASE_URL}/api/assertion/complete`,
    { email, clientAssertionResponse }
  );
  return response.data;
}
