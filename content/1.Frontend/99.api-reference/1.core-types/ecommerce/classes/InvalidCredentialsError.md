---
title: InvalidCredentialsError
description: declaration
---

Thrown when the authentication with the provided credentials fails.

## Extends

- `UnauthorizedError`

## Constructors

### Constructor

> **new InvalidCredentialsError**(): `InvalidCredentialsError`

#### Returns

`InvalidCredentialsError`

#### Overrides

`UnauthorizedError.constructor`

## Properties

| Property                                 | Type                           | Default value                | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---------------------------------------- | ------------------------------ | ---------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [](){#cause} `cause?`                    | `unknown`                      | `undefined`                  | Represents the underlying cause or source of the error.                                                                                                                                                                                                                                                                                                                                                                                                         |
| [](){#code} `code?`                      | `null` \| `string` \| `number` | `undefined`                  | A unique identifier for the error,&#xA;which can be a short uppercase string or a numeric code.                                                                                                                                                                                                                                                                                                                                                                 |
| [](){#data} `data?`                      | `unknown`                      | `undefined`                  | Additional data associated with the error. This property can hold&#xA;unstructured information or supplementary details that provide context&#xA;to the error.                                                                                                                                                                                                                                                                                                  |
| [](){#expose} `expose?`                  | `boolean`                      | `undefined`                  | Determines whether the error message can be safely exposed externally.                                                                                                                                                                                                                                                                                                                                                                                          |
| [](){#loglevel} `logLevel?`              | `string` \| `number`           | `undefined`                  | Specifies the log level at which this error should be recorded.                                                                                                                                                                                                                                                                                                                                                                                                 |
| [](){#logmessage} `logMessage?`          | `boolean`                      | `undefined`                  | Indicates whether the error should be logged in the application's logs.                                                                                                                                                                                                                                                                                                                                                                                         |
| [](){#message} `message`                 | `string`                       | `undefined`                  | ‐                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [](){#name} `name`                       | `string`                       | `undefined`                  | ‐                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [](){#redirecturl} `redirectURL?`        | `string`                       | `undefined`                  | Specify a redirect URL in case of a http error.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [](){#stack} `stack?`                    | `string`                       | `undefined`                  | ‐                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [](){#statuscode} `statusCode`           | `number`                       | `undefined`                  | A numeric Status Code between 400-599.                                                                                                                                                                                                                                                                                                                                                                                                                          |
| [](){#statusmessage} `statusMessage?`    | `string`                       | `undefined`                  | A status message.                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [](){#code-1} `code`                     | `"AUTH_INVALID_CREDENTIALS"`   | `'AUTH_INVALID_CREDENTIALS'` | ‐                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [](){#stacktracelimit} `stackTraceLimit` | `number`                       | `undefined`                  | The `Error.stackTraceLimit` property specifies the number of stack frames&#xA;collected by a stack trace (whether generated by `new Error().stack` or&#xA;`Error.captureStackTrace(obj)`).The default value is `10` but may be set to any valid JavaScript number. Changes&#xA;will affect any stack trace captured *after* the value has been changed.If set to a non-number value, or set to a negative number, stack traces will&#xA;not capture any frames. |

## Methods

### captureStackTrace()

> `static` **captureStackTrace**(`targetObject`: `object`, `constructorOpt?`: `Function`): `void`

Creates a `.stack` property on `targetObject`, which when accessed returns
a string representing the location in the code at which
`Error.captureStackTrace()` was called.

```js
const myObject = {};
Error.captureStackTrace(myObject);
myObject.stack;  // Similar to `new Error().stack`
```

The first line of the trace will be prefixed with
`${myObject.name}: ${myObject.message}`.

The optional `constructorOpt` argument accepts a function. If given, all frames
above `constructorOpt`, including `constructorOpt`, will be omitted from the
generated stack trace.

The `constructorOpt` argument is useful for hiding implementation
details of error generation from the user. For instance:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  // Create an error without stack trace to avoid calculating the stack trace twice.
  const { stackTraceLimit } = Error;
  Error.stackTraceLimit = 0;
  const error = new Error();
  Error.stackTraceLimit = stackTraceLimit;

  // Capture the stack trace above function b
  Error.captureStackTrace(error, b); // Neither function c, nor b is included in the stack trace
  throw error;
}

a();
```

#### Parameters

| Parameter         | Type       |
| ----------------- | ---------- |
| `targetObject`    | `object`   |
| `constructorOpt?` | `Function` |

#### Returns

`void`

#### Inherited from

`UnauthorizedError.captureStackTrace`

---

### prepareStackTrace()

> `static` **prepareStackTrace**(`err`: `Error`, `stackTraces`: `CallSite`[] ): `any`

#### Parameters

| Parameter     | Type         |
| ------------- | ------------ |
| `err`         | `Error`      |
| `stackTraces` | `CallSite`[] |

#### Returns

`any`

#### See

<https://v8.dev/docs/stack-trace-api#customizing-stack-traces>

#### Inherited from

`UnauthorizedError.prepareStackTrace`
