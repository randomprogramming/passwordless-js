import ApiClient from "./api";
import { CredentialError, ServerError } from "./exceptions";
import { abtb64, b64tab } from "./util/encoding";

class Passwordless {
  private apiClient: ApiClient;

  constructor(publicKey: string) {
    this.apiClient = new ApiClient(publicKey);
  }

  public registerBegin = async (email: string) => {
    // Registration begin:
    let attestationOptions;
    try {
      attestationOptions = await this.apiClient.registerBegin(email);
    } catch (err) {
      throw new ServerError("Server failed to return registration options.");
    }

    const publicKey = {
      ...attestationOptions,
      challenge: b64tab(attestationOptions.challenge),
      user: {
        ...attestationOptions.user,
        id: b64tab(window.btoa(attestationOptions.user.id)),
      },
    };

    const credential = (await navigator.credentials.create({
      publicKey,
    })) as PublicKeyCredential | null;
    if (!credential) {
      throw new CredentialError("Failed to create credentials.");
    }

    // TODO: Send transports to backend

    // Registration complete:
    const encodedCredential: any = {
      ...credential,
      id: credential.id,
      rawId: abtb64(credential.rawId),
      response: {
        ...credential.response,
        clientDataJSON: abtb64(credential.response.clientDataJSON),
      },
      type: credential.type,
    };

    // These properties do not exist in TypeScript for some reason
    if ((credential as any).authenticatorAttachment) {
      encodedCredential.authenticatorAttachment = (
        credential as any
      ).authenticatorAttachment;
    }
    if ((credential.response as any).attestationObject) {
      encodedCredential.response.attestationObject = abtb64(
        (credential.response as any).attestationObject
      );
    }

    try {
      await this.apiClient.registerComplete(email, encodedCredential);
    } catch (err) {
      throw new ServerError("Server failed to complete registration.");
    }
  };

  public loginBegin = async (email: string) => {
    let assertionOptions;
    try {
      assertionOptions = await this.apiClient.loginBegin(email);
    } catch (err) {
      throw new ServerError("Server failed to return login options.");
    }

    const decodedAssertionOptions = {
      ...assertionOptions,
      challenge: b64tab(assertionOptions.challenge),
    };

    const assertionResponseNullable = await navigator.credentials.get({
      publicKey: decodedAssertionOptions,
    });

    if (!assertionResponseNullable) {
      throw new CredentialError("Assertion response was empty, login failed.");
    }

    // TODO: Implement checks for this
    const assertionResponse = assertionResponseNullable as PublicKeyCredential;

    // TODO: Implement a single method which transforms all Binary(Buffer/ArrayBuffer) data into B64
    const encoded: any = {
      ...assertionResponse,
      id: assertionResponse.id,
      rawId: abtb64(assertionResponse.rawId),
      response: {
        clientDataJSON: abtb64(assertionResponse.response.clientDataJSON),
      },
      type: assertionResponse.type,
    };

    // TODO: Replace this with a for loop
    const authenticatorData = (assertionResponse.response as any)
      .authenticatorData;
    if (authenticatorData) {
      encoded.response.authenticatorData = abtb64(authenticatorData);
    }

    const signature = (assertionResponse.response as any).signature;
    if (signature) {
      encoded.response.signature = abtb64(signature);
    }

    const userHandle = (assertionResponse.response as any).userHandle;
    if (userHandle) {
      encoded.response.userHandle = abtb64(userHandle);
    }

    return { email, clientAssertionResponse: encoded };
  };
}

export { Passwordless };
