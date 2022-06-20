## Overview

A wrapper for the [unpass.me](unpass.me) API. You will need to register for a Public Key.

## Installing

### NPM

```bash
npm install passwordless-js
```

### Yarn

```bash
yarn add passwordless-js
```

## Usage

#### Import Library

```js
import { Passwordless } from "passwordless-js";
```

#### Create an instance

```js
const passwordless = new Passwordless(your_public_key);
```

#### Registering a users device

```js
await passwordless.registerDevice(user_email);
```

When a user wants to access your website later from a different device, they will need to register that new device again.

#### Authenticating a user

```js
const loginData = await passwordless.loginBegin(user_email);
```

The `loginBegin` method returns an object which our server uses to verify and authenticate the user. You will need to send that object to your own server, where you may then use `passwordless-node` along with your private key to authenticate the user.
