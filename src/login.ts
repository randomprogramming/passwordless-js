import { loginBegin, loginComplete } from "./api";
import { CredentialError, ServerError } from "./exceptions";
import { abtb64, b64tab } from "./util/encoding";

export default async function (email: string) {
  let assertionOptions;
  try {
    assertionOptions = await loginBegin(email);
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

  // TODO: The client should send this to their server, and then transfer it to our server to validate
  await loginComplete(email, encoded);
  return true;
}
