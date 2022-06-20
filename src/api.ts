import type { Axios } from "axios";
import axios from "axios";
import { PASSWORDLESS_SERVER_BASE_URL } from "./constants";

export default class ApiClient {
  private publicKey: string;
  private client: Axios;
  private serverBaseUrl: string;

  constructor(publicKey: string, customServerBaseUrl?: string) {
    this.serverBaseUrl = customServerBaseUrl || PASSWORDLESS_SERVER_BASE_URL;
    this.publicKey = publicKey;
    this.client = axios.create({
      baseURL: this.serverBaseUrl,
      headers: {
        Authorization: `Basic ${this.publicKey}`,
      },
    });
  }

  public registerBegin = async (email: string) => {
    const response = await this.client.post("/attestation/begin", {
      email,
    });
    return response.data;
  };

  public registerComplete = async (email: string, credentials: object) => {
    const response = await this.client.post("/attestation/complete", {
      credentials,
      email,
    });
    return response.data;
  };

  public loginBegin = async (email: string) => {
    const response = await this.client.post("/assertion/begin", { email });
    return response.data;
  };
}
