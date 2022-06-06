import type { Axios } from "axios";
import axios from "axios";

// TODO: Put this in some sort of env variable /// not sure yet
const PASSWORDLESS_SERVER_BASE_URL = "http://localhost:3003";

export default class ApiClient {
  private publicKey: string;
  private client: Axios;

  constructor(publicKey: string) {
    this.publicKey = publicKey;
    this.client = axios.create({
      baseURL: PASSWORDLESS_SERVER_BASE_URL,
      headers: {
        Authorization: `Basic ${this.publicKey}`,
      },
    });
  }

  public async registerBegin(email: string) {
    const response = await this.client.post("/api/attestation/begin", {
      email,
    });
    return response.data;
  }

  public async registerComplete(email: string, credentials: object) {
    const response = await this.client.post("/api/attestation/complete", {
      credentials,
      email,
    });
    return response.data;
  }

  public async loginBegin(email: string) {
    const response = await this.client.post("/api/assertion/begin", { email });
    return response.data;
  }
}
