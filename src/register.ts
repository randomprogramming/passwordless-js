import { registerBegin, registerComplete } from "./api";
import { CredentialError, ServerError } from "./exceptions";
import { abtb64, b64tab } from "./util/encoding";

export default async function (email: string) {
  // Registration begin:
  const enc = new TextEncoder();
  let attestationOptions;
  try {
    attestationOptions = await registerBegin(email);
  } catch (err) {
    throw new ServerError("Server failed to return registration options.");
  }

  const accountId = attestationOptions.user.id;
  const publicKey = {
    ...attestationOptions,
    challenge: b64tab(attestationOptions.challenge),
    user: {
      ...attestationOptions.user,
      id: enc.encode(attestationOptions.user.id),
    },
  };

  const credential = (await navigator.credentials.create({
    publicKey,
  })) as PublicKeyCredential | null;
  if (!credential) {
    throw new CredentialError("Failed to create credentials.");
  }

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
    encodedCredential.attestationObject = abtb64(
      (credential.response as any).attestationObject
    );
  }

  try {
    await registerComplete(encodedCredential, accountId);
  } catch (err) {
    throw new ServerError("Server failed to complete registration.");
  }
}
