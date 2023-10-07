<a href="#" align="">

![](https://i.imgur.com/37MaHi6.png)

</a>

<div align="center">
<p> Tiny package for sending and receiving <code>https(s)</code> requests </p>

[![install size](https://packagephobia.com/badge?p=@splitscript.js/https)](https://packagephobia.com/result?p=@splitscript.js/https)

[![downloads](https://img.shields.io/npm/dm/@splitscript.js/https?color=90ee90&style=flat)](https://www.npmjs.com/package/@splitscript.js/https)

<a href='https://splitscript.js.org/https' style='text-decoration:none;'>

<img src='https://i.imgur.com/8PqPYu0.png' alt='docs' height='100px'>
</a>

</div>

## About

This package is part of [SplitScript.js, the everything framework](https://splitscript.js.org)

It's a tiny package for sending `http(s)` requests

## Install

```bash
$ npm i @splitscript.js/https
```

## Listen for requests

### Start the server

```ts
import https from '@splitscript.js/https'
https.start({ port: 3000 })
```

### Handle requests

Create a file in functions/http/get

```ts
import { Events } from '@splitscript.js/https'
export default async function ({ req, res }: Events.Get) {
	res.write('<html><body><h1>hello world</h1></body></html>')
	res.end()
}
```

### Parse body

Bodys get parsed automatically

```ts
import { Events } from '@splitscript.js/https'
export default async function ({ req, res, bodyParsed }: Events.Post}) {
    res.end(JSON.stringify(bodyParsed))
}
```

### Raw body

To get the raw body

```ts
import { Events } from '@splitscript.js/https'
export default async function ({ req, res, body }: Events.Post}) {
    res.end(body)
}
```

<div align="center">
<sub><code>v2.0.1</code> | <a href='https://splitscript.js.org/https'>docs</a> </sub>

<sub>by [ultraviolet](https://github.com/ultravioletasdf)</sub>

</div>
