# PStream Documentation (Complete)
**Scraped Date:** 2026-01-02

## Table of Contents
- [/](#)
- [/get-started/introduction](#getstartedintroduction)
- [/get-started/quick-start](#getstartedquickstart)
- [/essentials/targets](#essentialstargets)
- [/essentials/using-streams](#essentialsusingstreams)
- [/essentials/usage-on-x](#essentialsusageonx)
- [/essentials/customize-providers](#essentialscustomizeproviders)
- [/essentials/fetchers](#essentialsfetchers)
- [/in-depth/development](#indepthdevelopment)
- [/in-depth/flags](#indepthflags)
- [/in-depth/sources-and-embeds](#indepthsourcesandembeds)
- [/in-depth/building-scrapers](#indepthbuildingscrapers)
- [/in-depth/setup-and-prerequisites](#indepthsetupandprerequisites)
- [/in-depth/provider-system](#indepthprovidersystem)
- [/in-depth/advanced-concepts](#indepthadvancedconcepts)
- [/api-reference/makeproviders](#apireferencemakeproviders)
- [/api-reference/providercontrolsrunsourcescraper](#apireferenceprovidercontrolsrunsourcescraper)
- [/api-reference/providercontrolsrunembedscraper](#apireferenceprovidercontrolsrunembedscraper)
- [/api-reference/providercontrolsrunall](#apireferenceprovidercontrolsrunall)
- [/api-reference/providercontrolslistsources](#apireferenceprovidercontrolslistsources)
- [/api-reference/providercontrolslistembeds](#apireferenceprovidercontrolslistembeds)
- [/api-reference/makestandardfetcher](#apireferencemakestandardfetcher)
- [/api-reference/makesimpleproxyfetcher](#apireferencemakesimpleproxyfetcher)
- [/api-reference/providercontrolsgetmetadata](#apireferenceprovidercontrolsgetmetadata)

---


<a name=''></a>
# 📂 PATH: /
**Source:** https://providers.pstream.mov/

@p-stream/providers | For all your media scraping needs · @p-stream/providers

# @p-stream/providers

Easily scrape all sorts of media sites for content

[Get Started](/get-started/introduction)[Open on GitHub →](https://github.com/p-stream/providers)

Bash

$npm i @p-stream/providers@github:p-stream/providers

Click to copy

## What's included

### Scrape popular streaming websites.

Don't settle for just one media site for you content, use everything that's available.

### Multi-platform.

Scrape from browser or server, whichever you prefer.

### Easy to use.

Get started with scraping your favourite media sites with just 5 lines of code. Fully typed of course.
---

<a name='getstartedintroduction'></a>
# 📂 PATH: /get-started/introduction
**Source:** https://providers.pstream.mov/get-started/introduction

Introduction · @p-stream/providers

# [Introduction](/get-started/introduction#introduction)

## [What is `@p-stream/providers`?](/get-started/introduction#what-is-p-streamproviders)

`@p-stream/providers` is the soul of [p-stream](https://github.com/p-stream/p-stream). It's a collection of scrapers of various streaming sites. It extracts the raw streams from those sites, so you can watch them without any extra fluff from the original sites.

## [What can I use this on?](/get-started/introduction#what-can-i-use-this-on)

We support many different environments, here are a few examples:

* In browser, watch streams without needing a server to scrape (does need a proxy)
* In a native app, scrape in the app itself
* In a backend server, scrape on the server and give the streams to the client to watch.

To find out how to configure the library for your environment, You can read [How to use on X](/essentials/usage-on-x).

[Get StartedQuick start](/get-started/quick-start)

Table of Contents

Table of Contents

* [What is @p-stream/providers?](#what-is-p-streamproviders)
* [What can I use this on?](#what-can-i-use-this-on)
---

<a name='getstartedquickstart'></a>
# 📂 PATH: /get-started/quick-start
**Source:** https://providers.pstream.mov/get-started/quick-start

Quick start · @p-stream/providers

# [Quick start](/get-started/quick-start#quick-start)

## [Installation](/get-started/quick-start#installation)

Let's get started with `@p-stream/providers`. First lets install the package.

**Note:** The `@p-stream/providers` package is not published on npm. Install it directly from GitHub using the following commands:

NPMYarnPNPM

NPM

```
npm install @p-stream/providers@github:p-stream/providers#production
```

Copy to clipboard

Yarn

```
yarn add @p-stream/providers@github:p-stream/providers#production
```

Copy to clipboard

PNPM

```
pnpm add @p-stream/providers@github:p-stream/providers#production
```

Copy to clipboard

## [Scrape your first item](/get-started/quick-start#scrape-your-first-item)

To get started with scraping on the **server**, first you have to make an instance of the providers.

This snippet will only work on a **server**. For other environments, check out [Usage on X](/essentials/usage-on-x).

index.ts (server)

```
import { makeProviders, makeStandardFetcher, targets } from '@p-stream/providers';

// this is how the library will make http requests
const myFetcher = makeStandardFetcher(fetch);

// make an instance of the providers library
const providers = makeProviders({
  fetcher: myFetcher,

  // will be played on a native video player
  target: targets.NATIVE
})
```

Copy to clipboard

Perfect. You now have an instance of the providers you can reuse everywhere.
Now let's scrape an item:

index.ts (server)

```
// fetch some data from TMDB
const media = {
  type: 'movie',
  title: "Hamilton",
  releaseYear: 2020,
  tmdbId: "556574"
}
  
const output = await providers.runAll({
  media: media
})
```

Copy to clipboard

Now we have our stream in the output variable. (If the output is `null` then nothing could be found.)
To find out how to use the streams, check out [Using streams](/essentials/using-streams).

[Get StartedIntroduction](/get-started/introduction)[EssentialsHow to use on X](/essentials/usage-on-x)

Table of Contents

Table of Contents

* [Installation](#installation)
* [Scrape your first item](#scrape-your-first-item)
---

<a name='essentialstargets'></a>
# 📂 PATH: /essentials/targets
**Source:** https://providers.pstream.mov/essentials/targets

Targets · @p-stream/providers

# [Targets](/essentials/targets#targets)

When creating provider controls, you will immediately be required to choose a target.

A target is the device on which the stream will be played.
**Where the scraping is run has nothing to do with the target**, only where the stream is finally played in the end is significant in choosing a target.

#### [Possible targets](/essentials/targets#possible-targets)

* **`targets.BROWSER`** Stream will be played in a browser with CORS
* **`targets.BROWSER_EXTENSION`** Stream will be played in a browser using the p-stream extension (WIP)
* **`targets.NATIVE`** Stream will be played on a native video player
* **`targets.ANY`** No restrictions for selecting streams, will just give all of them

[EssentialsHow to use on X](/essentials/usage-on-x)[EssentialsFetchers](/essentials/fetchers)
---

<a name='essentialsusingstreams'></a>
# 📂 PATH: /essentials/using-streams
**Source:** https://providers.pstream.mov/essentials/using-streams

Using streams · @p-stream/providers

# [Using streams](/essentials/using-streams#using-streams)

Streams can sometimes be quite picky on how they can be used. So here is a guide on how to use them.

## [Essentials](/essentials/using-streams#essentials)

All streams have the same common parameters:

* `Stream.type`: The type of stream. Either `hls` or `file`
* `Stream.id`: The id of this stream, unique per scraper output.
* `Stream.flags`: A list of flags that apply to this stream. Most people won't need to use it.
* `Stream.captions`: A list of captions/subtitles for this stream.
* `Stream.headers`: Either undefined or a key value object of headers you must set to use the stream.
* `Stream.preferredHeaders`: Either undefined or a key value object of headers you may want to set if you want optimal playback - but not required.

Now let's delve deeper into how to watch these streams!

## [Streams with type `hls`](/essentials/using-streams#streams-with-type-hls)

HLS streams can be tough to watch. They're not normal files you can just use.
These streams have an extra property `Stream.playlist` which contains the m3u8 playlist.

Here is a code sample of how to use HLS streams in web context using hls.js

```
<script src="https://cdn.jsdelivr.net/npm/hls.js@1"></script>

<video id="video"></video>
<script>
  const stream = null; // add your stream here

  if (Hls.isSupported()) {
    var video = document.getElementById('video');
    var hls = new Hls();
    hls.loadSource(stream.playlist);
    hls.attachMedia(video);
  }
</script>
```

Copy to clipboard

## [Streams with type `file`](/essentials/using-streams#streams-with-type-file)

File streams are quite easy to use, they just return a new property: `Stream.qualities`.
This property is a map of quality and a stream file. So if you want to get 1080p quality you do `stream["1080"]` to get your stream file. It will return undefined if that quality is absent.

The possibly qualities are: `unknown`, `360`, `480`, `720`, `1080`, `4k`.
File based streams are always guaranteed to have one quality.

Once you get a streamfile, you have the following parameters:

* `StreamFile.type`: Right now it can only be `mp4`.
* `StreamFile.url`: The URL linking to the video file.

Here is a code sample of how to watch a file based stream in a browser:

```
<video id="video"></video>
<script>
  const stream = null; // add your stream here
  const video = document.getElementById('video');

  const qualityEntries = Object.keys(stream.qualities);
  const firstQuality = qualityEntries[0];
  video.src = firstQuality.url;
</script>
```

Copy to clipboard

## [Streams with headers](/essentials/using-streams#streams-with-headers)

Streams have both a `Stream.headers` and a `Stream.preferredHeaders`.
The difference between the two is that `Stream.headers` **must** be set in order for the stream to work. While the other is optional, and enhances the quality or performance.

If your target is set to `BROWSER`, headers will never be required, as it's not possible to do.

## [Using captions/subtitles](/essentials/using-streams#using-captionssubtitles)

All streams have a list of captions at `Stream.captions`. The structure looks like this:

```
type Caption = {
  type: CaptionType; // Language type, either "srt" or "vtt"
  id: string; // Unique per stream
  url: string; // The URL pointing to the subtitle file
  hasCorsRestrictions: boolean; // If true, you will need to proxy it if you're running in a browser
  language: string; // Language code of the caption
};
```

Copy to clipboard

[EssentialsCustomize providers](/essentials/customize-providers)[In DepthDevelopment Guide](/in-depth/development)

Table of Contents

Table of Contents

* [Essentials](#essentials)
* [Streams with type hls](#streams-with-type-hls)
* [Streams with type file](#streams-with-type-file)
* [Streams with headers](#streams-with-headers)
* [Using captions/subtitles](#using-captionssubtitles)
---

<a name='essentialsusageonx'></a>
# 📂 PATH: /essentials/usage-on-x
**Source:** https://providers.pstream.mov/essentials/usage-on-x

How to use on X · @p-stream/providers

# [How to use on X](/essentials/usage-on-x#how-to-use-on-x)

The library can run in many environments, so it can be tricky to figure out how to set it up.

Here is a checklist. For more specific environments, keep reading below:

* When requests are very restricted (like browser client-side). Configure a proxied fetcher.
* When your requests come from the same device on which it will be streamed (not compatible with proxied fetcher). Set `consistentIpForRequests: true`.
* To set a target. Consult [Targets](/essentials/targets).

To make use of the examples below, check out the following pages:

* [Quick start](/get-started/quick-start)
* [Using streams](/essentials/using-streams)

## [NodeJs server](/essentials/usage-on-x#nodejs-server)

```
import { makeProviders, makeStandardFetcher, targets } from '@p-stream/providers';

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  target: chooseYourself, // check out https://p-stream.github.io/providers/essentials/targets
})
```

Copy to clipboard

## [Browser client-side](/essentials/usage-on-x#browser-client-side)

Using the provider package client-side requires a hosted version of simple-proxy.
Read more [about proxy fetchers](/essentials/fetchers#using-fetchers-on-the-browser).

```
import { makeProviders, makeStandardFetcher, targets } from '@p-stream/providers';

const proxyUrl = "https://your.proxy.workers.dev/";

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),
  target: target.BROWSER,
})
```

Copy to clipboard

## [React native](/essentials/usage-on-x#react-native)

To use the library in a react native app, you would also need a couple of polyfills to polyfill crypto and base64.

1. First install the polyfills:

```
npm install @react-native-anywhere/polyfill-base64 react-native-quick-crypto
```

Copy to clipboard

2. Add the polyfills to your app:

```
// Import in your entry file
import '@react-native-anywhere/polyfill-base64';
```

Copy to clipboard

And follow the [react-native-quick-crypto documentation](https://github.com/margelo/react-native-quick-crypto) to set up the crypto polyfill.

3. Then you can use the library like this:

```
import { makeProviders, makeStandardFetcher, targets } from '@p-stream/providers';

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  target: target.NATIVE,
  consistentIpForRequests: true,
})
```

Copy to clipboard

[Get StartedQuick start](/get-started/quick-start)[EssentialsTargets](/essentials/targets)

Table of Contents

Table of Contents

* [NodeJs server](#nodejs-server)
* [Browser client-side](#browser-client-side)
* [React native](#react-native)
---

<a name='essentialscustomizeproviders'></a>
# 📂 PATH: /essentials/customize-providers
**Source:** https://providers.pstream.mov/essentials/customize-providers

Customize providers · @p-stream/providers

# [Customize providers](/essentials/customize-providers#customize-providers)

You make the provider controls in two ways. Either with `makeProviders()` (the simpler option) or with `buildProviders()` (more elaborate and extensive option).

## [`makeProviders()` (simple)](/essentials/customize-providers#makeproviders-simple)

To know what to set the configuration to, you can read [How to use on X](/essentials/usage-on-x) for a detailed guide on how to configure your controls.

```
const providers = makeProviders({
  // fetcher, every web request gets called through here
  fetcher: makeStandardFetcher(fetch),
  
  // proxied fetcher, if the scraper needs to access a CORS proxy. this fetcher will be called instead
  // of the normal fetcher. Defaults to the normal fetcher.
  proxiedFetcher: undefined;

  // target of where the streams will be used
  target: targets.NATIVE;

  // Set this to true, if the requests will have the same IP as
  // the device that the stream will be played on.
  consistentIpForRequests: false;
})
```

Copy to clipboard

## [`buildProviders()` (advanced)](/essentials/customize-providers#buildproviders-advanced)

To know what to set the configuration to, you can read [How to use on X](/essentials/usage-on-x) for a detailed guide on how to configure your controls.

### [Standard setup](/essentials/customize-providers#standard-setup)

```
const providers = buildProviders()
  .setTarget(targets.NATIVE) // target of where the streams will be used
  .setFetcher(makeStandardFetcher(fetch)) // fetcher, every web request gets called through here
  .addBuiltinProviders() // add all builtin providers, if this is not called, no providers will be added to the controls
  .build();
```

Copy to clipboard

### [Adding only select few providers](/essentials/customize-providers#adding-only-select-few-providers)

Not all providers are great quality, so you can make an instance of the controls with only the providers you want.

```
const providers = buildProviders()
  .setTarget(targets.NATIVE) // target of where the streams will be used
  .setFetcher(makeStandardFetcher(fetch)) // fetcher, every web request gets called through here
  .addSource('showbox') // only add showbox source
  .addEmbed('febbox-hls') // add febbox-hls embed, which is returned by showbox
  .build();
```

Copy to clipboard

### [Adding your own scrapers to the providers](/essentials/customize-providers#adding-your-own-scrapers-to-the-providers)

If you have your own scraper and still want to use the nice utilities of the provider library or just want to add on to the built-in providers, you can add your own custom source.

```
const providers = buildProviders()
  .setTarget(targets.NATIVE) // target of where the streams will be used
  .setFetcher(makeStandardFetcher(fetch)) // fetcher, every web request gets called through here
  .addSource({ // add your own source
    id: 'my-scraper',
    name: 'My scraper',
    rank: 800,
    flags: [],
    scrapeMovie(ctx) {
      throw new Error('Not implemented');
    }
  })
  .build();
```

Copy to clipboard

[EssentialsFetchers](/essentials/fetchers)[EssentialsUsing streams](/essentials/using-streams)

Table of Contents

Table of Contents

* [makeProviders() (simple)](#makeproviders-simple)
* [buildProviders() (advanced)](#buildproviders-advanced)
  + [Standard setup](#standard-setup)
  + [Adding only select few providers](#adding-only-select-few-providers)
  + [Adding your own scrapers to the providers](#adding-your-own-scrapers-to-the-providers)
---

<a name='essentialsfetchers'></a>
# 📂 PATH: /essentials/fetchers
**Source:** https://providers.pstream.mov/essentials/fetchers

Fetchers · @p-stream/providers

# [Fetchers](/essentials/fetchers#fetchers)

When creating provider controls, a fetcher will need to be configured.
Depending on your environment, this can come with some considerations:

## [Using `fetch()`](/essentials/fetchers#using-fetch)

In most cases, you can use the `fetch()` API. This will work in newer versions of Node.js (18 and above) and on the browser.

```
const fetcher = makeStandardFetcher(fetch);
```

Copy to clipboard

If you using older version of Node.js. You can use the npm package `node-fetch` to polyfill fetch:

```
import fetch from "node-fetch";

const fetcher = makeStandardFetcher(fetch);
```

Copy to clipboard

## [Using fetchers on the browser](/essentials/fetchers#using-fetchers-on-the-browser)

When using this library on a browser, you will need a proxy. Browsers restrict when a web request can be made. To bypass those restrictions, you will need a CORS proxy.

The p-stream team has a proxy pre-made and pre-configured for you to use. For more information, check out [p-stream/simple-proxy](https://github.com/p-stream/simple-proxy). After installing, you can use this proxy like so:

```
const fetcher = makeSimpleProxyFetcher("https://your.proxy.workers.dev/", fetch);
```

Copy to clipboard

If you aren't able to use this specific proxy and need to use a different one, you can make your own fetcher in the next section.

## [Making a derived fetcher](/essentials/fetchers#making-a-derived-fetcher)

In some rare cases, a custom fetcher is necessary. This can be quite difficult to make from scratch so it's recommended to base it off of an existing fetcher and building your own functionality around it.

```
export function makeCustomFetcher(): Fetcher {
  const fetcher = makeStandardFetcher(f);
  const customFetcher: Fetcher = (url, ops) => {
    // Do something with the options and URL here
    return fetcher(url, ops);
  };

  return customFetcher;
}
```

Copy to clipboard

If you need to make your own fetcher for a proxy, ensure you make it compatible with the following headers: `Set-Cookie`, `Cookie`, `Referer`, `Origin`. Proxied fetchers need to be able to write/read those headers when making a request.

## [Making a fetcher from scratch](/essentials/fetchers#making-a-fetcher-from-scratch)

In some rare cases, you need to make a fetcher from scratch.
This is the list of features it needs:

* Send/read every header
* Parse JSON, otherwise parse as text
* Send JSON, Formdata or normal strings
* get final destination URL

It's not recommended to do this at all. If you have to, you can base your code on the original implementation of `makeStandardFetcher`. Check out the [source code for it here](https://github.com/p-stream/providers/blob/dev/src/fetchers/standardFetch.ts).

Here is a basic template on how to make your own custom fetcher:

```
const myFetcher: Fetcher = (url, ops) => {
  // Do some fetching
  return {
    body: {},
    finalUrl: '',
    headers: new Headers(), // should only contain headers from ops.readHeaders
    statusCode: 200,
  };
}
```

Copy to clipboard

[EssentialsTargets](/essentials/targets)[EssentialsCustomize providers](/essentials/customize-providers)

Table of Contents

Table of Contents

* [Using fetch()](#using-fetch)
* [Using fetchers on the browser](#using-fetchers-on-the-browser)
* [Making a derived fetcher](#making-a-derived-fetcher)
* [Making a fetcher from scratch](#making-a-fetcher-from-scratch)
---

<a name='indepthdevelopment'></a>
# 📂 PATH: /in-depth/development
**Source:** https://providers.pstream.mov/in-depth/development

Development Guide · @p-stream/providers

# [Development Guide](/in-depth/development#development-guide)

This guide covers everything you need to start contributing.

## [Get Started](/in-depth/development#get-started)

* **[Setup and Prerequisites](/in-depth/setup-and-prerequisites)** - Start here!

## [In-Depth Guides](/in-depth/development#in-depth-guides)

* **[Provider System](/in-depth/provider-system)** - How sources, embeds, and ranking work
* **[Building Scrapers](/in-depth/building-scrapers)** - Complete guide to creating scrapers
* **[Flags System](/in-depth/flags)** - Target compatibility and stream properties
* **[Advanced Concepts](/in-depth/advanced-concepts)** - Error handling, proxying, and best practices

[EssentialsUsing streams](/essentials/using-streams)[In DepthSetup and Prerequisites](/in-depth/setup-and-prerequisites)

Table of Contents

Table of Contents

* [Get Started](#get-started)
* [In-Depth Guides](#in-depth-guides)
---

<a name='indepthflags'></a>
# 📂 PATH: /in-depth/flags
**Source:** https://providers.pstream.mov/in-depth/flags

Flags · @p-stream/providers

# [Flags](/in-depth/flags#flags)

Flags are the primary way the library separates entities between different environments and indicates special properties of streams.

For example, some sources only give back content that has the CORS headers set to allow anyone, so that source gets the flag `CORS_ALLOWED`. Now if you set your target to `BROWSER`, sources without that flag won't even get listed.

Sometimes a source will block netlify or cloudflare. Making self hosted proxies on P-Stream impossible. In cases where it would break some user's experiences, we should require the extension.

## [Available Flags](/in-depth/flags#available-flags)

* **`CORS_ALLOWED`**: Headers from the output streams are set to allow any origin.
* **`IP_LOCKED`**: The streams are locked by IP: requester and watcher must be the same.
* **`CF_BLOCKED`**: *(Cosmetic)* Indicates the source/embed blocks Cloudflare IPs. For actual enforcement, remove `CORS_ALLOWED` or add `IP_LOCKED`.
* **`PROXY_BLOCKED`**: *(Cosmetic)* Indicates streams shouldn't be proxied. For actual enforcement, remove `CORS_ALLOWED` or add `IP_LOCKED`.

## [How Flags Affect Target Compatibility](/in-depth/flags#how-flags-affect-target-compatibility)

### [Stream-Level Flags Impact](/in-depth/flags#stream-level-flags-impact)

**With `CORS_ALLOWED`:**

* ✅ Browser targets (can fetch and play streams)
* ✅ Extension targets (bypass needed restrictions)
* ✅ Native targets (direct stream access)

**Without `CORS_ALLOWED`:**

* ❌ Browser targets (CORS restrictions block access)
* ✅ Extension targets (can bypass CORS)
* ✅ Native targets (no CORS restrictions)

**With `IP_LOCKED`:**

* ❌ Proxy setups (different IP between request and playback)
* ✅ Direct connections (same IP for request and playback)
* ✅ Extension targets (when user has consistent IP)

**With `CF_BLOCKED` *(cosmetic only)*:**

* 🏷️ Informational label indicating Cloudflare issues
* ⚠️ **Still requires removing `CORS_ALLOWED` or adding `IP_LOCKED` for actual enforcement**

**With `PROXY_BLOCKED` *(cosmetic only)*:**

* 🏷️ Informational label indicating proxy incompatibility
* ⚠️ **Still requires removing `CORS_ALLOWED` or adding `IP_LOCKED` for actual enforcement**

### [Provider-Level Flags Impact](/in-depth/flags#provider-level-flags-impact)

**With `CORS_ALLOWED`:**

* Source appears for all target types
* Individual streams still need appropriate flags

**Without `CORS_ALLOWED`:**

* Source only appears for extension/native targets
* Hidden entirely from browser-only users

### [Important: Cosmetic vs Enforcement Flags](/in-depth/flags#important-cosmetic-vs-enforcement-flags)

**Cosmetic flags** (`CF_BLOCKED`, `PROXY_BLOCKED`) are informational labels only. They don't enforce any behavior.

**Enforcement flags** (`CORS_ALLOWED`, `IP_LOCKED`) actually control stream compatibility:

* **Remove all flags**: Most common way to make streams extension/native-only (no browser support)
* **Add `IP_LOCKED`**: Prevents proxy usage when `consistentIpForRequests` is false (rarely needed - most extension-only streams just use no flags)

### [The Golden Rule](/in-depth/flags#the-golden-rule)

**Extension-only providers:** Remove all flags (most common case) when streams only work with extensions (e.g., need special headers or IP restrictions that only extensions can bypass).

**Universal providers:** Include `CORS_ALLOWED` flags when using M3U8 proxies or streams that can work across all targets.

## [Comprehensive Flags Guide](/in-depth/flags#comprehensive-flags-guide)

For detailed information about using flags in your scrapers, including:

* When and how to use each flag
* Provider-level vs stream-level flags
* Best practices and examples
* How flags affect stream playback

See the [Flags System section](/in-depth/advanced-concepts#flags-system) in Advanced Concepts.

## [Quick Reference](/in-depth/flags#quick-reference)

```
import { flags } from '@/entrypoint/utils/targets';
import { createM3U8ProxyUrl } from '@/utils/proxy';

// Extension-only streams (MOST COMMON - just remove all flags)
return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: createM3U8ProxyUrl(originalUrl, ctx.features, headers),
    headers,
    flags: [], // No flags = extension/native only, but this case doesn't make sense because the stream is getting proxied.
    captions: []
  }]
};

// Universal streams with CORS support
return {
  stream: [{
    id: 'primary',
    type: 'hls', 
    playlist: createM3U8ProxyUrl(originalUrl, ctx.features, headers),
    headers, // again listing headers twice so the extension can use them.
    flags: [flags.CORS_ALLOWED], // Works across all targets
    captions: []
  }]
};

// Direct streams (no proxy needed)
return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: 'https://example.com/playlist.m3u8',
    flags: [flags.CORS_ALLOWED], // Stream can be played directly in browsers
    captions: []
  }]
};

// Extension-only streams (usual approach - just remove all flags)
return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: 'https://example.com/playlist.m3u8',
    flags: [], // No flags = extension/native only (most common)
    captions: []
  }]
};

// Cloudflare-blocked streams with cosmetic label (if needed)
return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: 'https://example.com/playlist.m3u8',
    flags: [flags.CF_BLOCKED], // Cosmetic only - still extension/native only due to no CORS_ALLOWED
    captions: []
  }]
};

// IP-locked streams (when you specifically need consistent IP)
return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: 'https://example.com/playlist.m3u8',
    flags: [flags.IP_LOCKED], // Prevents proxy usage when IP consistency required
    captions: []
  }]
};

// IP-locked streams (when you specifically need consistent IP)
return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: 'https://example.com/playlist.m3u8',
    flags: [flags.IP_LOCKED], // Prevents proxy usage when IP consistency required
    captions: []
  }]
};

// Provider-level flags affect source visibility
export const myScraper = makeSourcerer({
  id: 'my-scraper',
  name: 'My Scraper', 
  rank: 150,
  flags: [flags.CORS_ALLOWED], // Source shows for all targets
  scrapeMovie: comboScraper,
  scrapeShow: comboScraper,
});
```

Copy to clipboard

[In DepthSources vs Embeds](/in-depth/sources-and-embeds)[In DepthAdvanced Concepts](/in-depth/advanced-concepts)

Table of Contents

Table of Contents

* [Available Flags](#available-flags)
* [How Flags Affect Target Compatibility](#how-flags-affect-target-compatibility)
  + [Stream-Level Flags Impact](#stream-level-flags-impact)
  + [Provider-Level Flags Impact](#provider-level-flags-impact)
  + [Important: Cosmetic vs Enforcement Flags](#important-cosmetic-vs-enforcement-flags)
  + [The Golden Rule](#the-golden-rule)
* [Comprehensive Flags Guide](#comprehensive-flags-guide)
* [Quick Reference](#quick-reference)
---

<a name='indepthsourcesandembeds'></a>
# 📂 PATH: /in-depth/sources-and-embeds
**Source:** https://providers.pstream.mov/in-depth/sources-and-embeds

Sources vs Embeds · @p-stream/providers

# [Sources vs Embeds](/in-depth/sources-and-embeds#sources-vs-embeds)

Understanding the difference between sources and embeds is crucial for building scrapers effectively. They work together in a two-stage pipeline to extract playable video streams.

## [The Two-Stage Pipeline](/in-depth/sources-and-embeds#the-two-stage-pipeline)

```
User Request → Source Scraper → What did source find?
                                      ↓
                               ┌─────────────┐
                               ↓             ↓
                        Direct Stream    Embed URLs
                               ↓             ↓
                          Play Video    Embed Scraper
                                            ↓
                                     Extract Stream
                                            ↓
                                      Play Video
```

Copy to clipboard

**Flow Breakdown:**

1. **User requests** content (movie/TV show)
2. **Source scraper** searches the target website
3. **Source returns** either:
   * **Direct streams** → Ready to play immediately
   * **Embed URLs** → Need further processing
4. **Embed scraper** (if needed) extracts streams from player URLs
5. **Final result** → Playable video stream

## [Sources: The Content Finders](/in-depth/sources-and-embeds#sources-the-content-finders)

**Sources** are the first stage - they find content on websites and return either:

1. **Direct video streams** (ready to play)
2. **Embed URLs** that need further processing

### [Example: Autoembed Source](/in-depth/sources-and-embeds#example-autoembed-source)

```
// From src/providers/sources/autoembed.ts
async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  // 1. Call an API to find video sources
  const data = await ctx.proxiedFetcher(`/api/getVideoSource`, {
    baseUrl: 'https://tom.autoembed.cc',
    query: { type: mediaType, id }
  });

  // 2. Return embed URLs for further processing
  return {
    embeds: [{
      embedId: 'autoembed-english',  // Points to an embed scraper
      url: data.videoSource          // URL that embed will process
    }]
  };
}
```

Copy to clipboard

**What this source does:**

* Queries an API with TMDB ID
* Gets back a video source URL
* Returns it as an embed for the `autoembed-english` embed scraper to handle

### [Example: Catflix Source](/in-depth/sources-and-embeds#example-catflix-source)

```
// From src/providers/sources/catflix.ts  
async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  // 1. Build URL to the movie/show page
  const watchPageUrl = `${baseUrl}/movie/${mediaTitle}-${movieId}`;
  
  // 2. Scrape the page for embedded player URLs
  const watchPage = await ctx.proxiedFetcher(watchPageUrl);
  const $ = load(watchPage);
  
  // 3. Extract and decode the embed URL
  const mainOriginMatch = scriptData.data.match(/main_origin = "(.*?)";/);
  const decodedUrl = atob(mainOriginMatch[1]);

  // 4. Return embed URL for turbovid embed to process
  return {
    embeds: [{
      embedId: 'turbovid',          // Points to turbovid embed scraper
      url: decodedUrl               // Turbovid player URL
    }]
  };
}
```

Copy to clipboard

**What this source does:**

* Scrapes a streaming website
* Finds encoded embed player URLs in the page source
* Decodes the URL and returns it for the `turbovid` embed scraper

## [Embeds: The Stream Extractors](/in-depth/sources-and-embeds#embeds-the-stream-extractors)

**Embeds** are the second stage - they take URLs from sources and extract the actual playable video streams. Each embed type knows how to handle a specific player or service.

### [Example: Autoembed Embed (Simple)](/in-depth/sources-and-embeds#example-autoembed-embed-simple)

```
// From src/providers/embeds/autoembed.ts
async scrape(ctx) {
  // The URL from the source is already a direct HLS playlist
  return {
    stream: [{
      id: 'primary',
      type: 'hls',
      playlist: ctx.url,  // Use the URL directly as HLS playlist
      flags: [flags.CORS_ALLOWED],
      captions: []
    }]
  };
}
```

Copy to clipboard

**What this embed does:**

* Takes the URL from autoembed source
* Treats it as a direct HLS playlist (no further processing needed)
* Returns it as a playable stream

### [Example: Turbovid Embed (Complex)](/in-depth/sources-and-embeds#example-turbovid-embed-complex)

```
// From src/providers/embeds/turbovid.ts
async scrape(ctx) {
  // 1. Fetch the turbovid player page
  const embedPage = await ctx.proxiedFetcher(ctx.url);
  
  // 2. Extract encryption keys from the page
  const apkey = embedPage.match(/const\s+apkey\s*=\s*"(.*?)";/)?.[1];
  const xxid = embedPage.match(/const\s+xxid\s*=\s*"(.*?)";/)?.[1];
  
  // 3. Get decryption key from API
  const encodedJuiceKey = JSON.parse(
    await ctx.proxiedFetcher('/api/cucked/juice_key', { baseUrl })
  ).juice;
  
  // 4. Get encrypted playlist data
  const data = JSON.parse(
    await ctx.proxiedFetcher('/api/cucked/the_juice_v2/', {
      baseUrl, query: { [apkey]: xxid }
    })
  ).data;
  
  // 5. Decrypt the playlist URL
  const playlist = decrypt(data, atob(encodedJuiceKey));
  
  // 6. Return proxied stream (handles CORS/headers)
  return {
    stream: [{
      type: 'hls',
      id: 'primary',
      playlist: createM3U8ProxyUrl(playlist, ctx.features, streamHeaders),
      headers: streamHeaders,
      flags: [], captions: []
    }]
  };
}
```

Copy to clipboard

**What this embed does:**

* Takes turbovid player URL from catflix source
* Performs complex extraction: fetches page → gets keys → decrypts data
* Returns the final HLS playlist with proper proxy handling

## [Key Differences](/in-depth/sources-and-embeds#key-differences)

| Sources | Embeds |
| --- | --- |
| **Find content** on websites | **Extract streams** from players |
| Return embed URLs OR direct streams | Always return direct streams |
| Handle website navigation/search | Handle player-specific extraction |
| Can return multiple server options | Process one specific player type |
| Example: "Find Avengers on Catflix" | Example: "Extract stream from Turbovid player" |

## [Why This Separation?](/in-depth/sources-and-embeds#why-this-separation)

### [1. **Reusability**](/in-depth/sources-and-embeds#_1-reusability)

Multiple sources can use the same embed:

```
// Both catflix and other sources can return turbovid embeds
{ embedId: 'turbovid', url: 'https://turbovid.com/player123' }
```

Copy to clipboard

### [2. **Multiple Server Options**](/in-depth/sources-and-embeds#_2-multiple-server-options)

Sources can provide backup servers:

```
return {
  embeds: [
    { embedId: 'turbovid', url: 'https://turbovid.com/player123' },
    { embedId: 'vidcloud', url: 'https://vidcloud.co/embed456' },
    { embedId: 'dood', url: 'https://dood.watch/789' }
  ]
};
```

Copy to clipboard

### [3. **Language/Quality Variants**](/in-depth/sources-and-embeds#_3-languagequality-variants)

Sources can offer different options:

```
return {
  embeds: [
    { embedId: 'autoembed-english', url: streamUrl },
    { embedId: 'autoembed-spanish', url: streamUrlEs },
    { embedId: 'autoembed-hindi', url: streamUrlHi }
  ]
};
```

Copy to clipboard

### [4. **Specialization**](/in-depth/sources-and-embeds#_4-specialization)

* **Sources** specialize in website structures and search
* **Embeds** specialize in player technologies and decryption

## [How They Work Together](/in-depth/sources-and-embeds#how-they-work-together)

### [Flow Example: Finding "Spirited Away"](/in-depth/sources-and-embeds#flow-example-finding-spirited-away)

1. **Source (catflix)**:
   * Searches catflix.su for "Spirited Away"
   * Finds movie page with embedded player
   * Extracts turbovid URL: `https://turbovid.com/embed/abc123`
   * Returns: `{ embedId: 'turbovid', url: 'https://turbovid.com/embed/abc123' }`
2. **Embed (turbovid)**:
   * Receives the turbovid URL
   * Scrapes the player page for encryption keys
   * Decrypts the actual HLS playlist URL
   * Returns: `{ stream: [{ playlist: 'https://cdn.example.com/movie.m3u8' }] }`
3. **Result**: User can now play the video stream

### [Error Handling Chain](/in-depth/sources-and-embeds#error-handling-chain)

If the embed fails to extract a stream:

```
// Source provides multiple backup options
return {
  embeds: [
    { embedId: 'turbovid', url: url1 },     // Try first
    { embedId: 'mixdrop', url: url2 },      // Fallback 1  
    { embedId: 'dood', url: url3 }          // Fallback 2
  ]
};
```

Copy to clipboard

The system tries each embed in rank order until one succeeds.

## [Best Practices](/in-depth/sources-and-embeds#best-practices)

### [For Sources:](/in-depth/sources-and-embeds#for-sources)

* Provide multiple embed options when possible
* Use descriptive embed IDs that match existing embeds
* Handle both movies and TV shows (combo scraper pattern)
* Return direct streams when embed processing isn't needed

### [For Embeds:](/in-depth/sources-and-embeds#for-embeds)

* Focus on one player type per embed
* Handle errors gracefully with clear error messages
* Use proxy functions for protected streams
* Include proper headers and flags

### [Registration:](/in-depth/sources-and-embeds#registration)

```
// In src/providers/all.ts
export function gatherAllSources(): Array<Sourcerer> {
  return [catflixScraper, autoembedScraper, /* ... */];
}

export function gatherAllEmbeds(): Array<Embed> {
  return [turbovidScraper, autoembedEnglishScraper, /* ... */];
}
```

Copy to clipboard

Both sources and embeds must be registered in `all.ts` to be available for use.

[In DepthBuilding Scrapers](/in-depth/building-scrapers)[In DepthFlags](/in-depth/flags)

Table of Contents

Table of Contents

* [The Two-Stage Pipeline](#the-two-stage-pipeline)
* [Sources: The Content Finders](#sources-the-content-finders)
  + [Example: Autoembed Source](#example-autoembed-source)
  + [Example: Catflix Source](#example-catflix-source)
* [Embeds: The Stream Extractors](#embeds-the-stream-extractors)
  + [Example: Autoembed Embed (Simple)](#example-autoembed-embed-simple)
  + [Example: Turbovid Embed (Complex)](#example-turbovid-embed-complex)
* [Key Differences](#key-differences)
* [Why This Separation?](#why-this-separation)
  + [1. Reusability](#_1-reusability)
  + [2. Multiple Server Options](#_2-multiple-server-options)
  + [3. Language/Quality Variants](#_3-languagequality-variants)
  + [4. Specialization](#_4-specialization)
* [How They Work Together](#how-they-work-together)
  + [Flow Example: Finding "Spirited Away"](#flow-example-finding-spirited-away)
  + [Error Handling Chain](#error-handling-chain)
* [Best Practices](#best-practices)
  + [For Sources:](#for-sources)
  + [For Embeds:](#for-embeds)
  + [Registration:](#registration)
---

<a name='indepthbuildingscrapers'></a>
# 📂 PATH: /in-depth/building-scrapers
**Source:** https://providers.pstream.mov/in-depth/building-scrapers

Building Scrapers · @p-stream/providers

# [Building Scrapers](/in-depth/building-scrapers#building-scrapers)

This guide covers the technical details of implementing scrapers, from basic structure to advanced patterns.

## [The Combo Scraper Pattern](/in-depth/building-scrapers#the-combo-scraper-pattern)

The most common and recommended pattern is the "combo scraper" that handles both movies and TV shows with a single function. This reduces code duplication and ensures consistent behavior.

### [Basic Structure](/in-depth/building-scrapers#basic-structure)

```
import { SourcererEmbed, SourcererOutput, makeSourcerer } from '@/providers/base';
import { MovieScrapeContext, ShowScrapeContext } from '@/utils/context';
import { NotFoundError } from '@/utils/errors';

// Main scraping function that handles both movies and TV shows
async function comboScraper(ctx: ShowScrapeContext | MovieScrapeContext): Promise<SourcererOutput> {
  // 1. Build the appropriate URL based on media type
  const embedUrl = `https://embed.su/embed/${
    ctx.media.type === 'movie' 
      ? `movie/${ctx.media.tmdbId}` 
      : `tv/${ctx.media.tmdbId}/${ctx.media.season.number}/${ctx.media.episode.number}`
  }`;

  // 2. Fetch the embed page using proxied fetcher
  const embedPage = await ctx.proxiedFetcher<string>(embedUrl, {
    headers: {
      Referer: 'https://embed.su/',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    },
  });

  // 3. Extract and decode configuration
  const vConfigMatch = embedPage.match(/window\.vConfig\s*=\s*JSON\.parse\(atob\(`([^`]+)/i);
  const encodedConfig = vConfigMatch?.[1];
  if (!encodedConfig) throw new NotFoundError('No encoded config found');

  // 4. Process the data (decode, decrypt, etc.)
  const decodedConfig = JSON.parse(await stringAtob(encodedConfig));
  if (!decodedConfig?.hash) throw new NotFoundError('No stream hash found');

  // 5. Update progress to show we're making progress
  ctx.progress(50);

  // 6. Build the final result
  const embeds: SourcererEmbed[] = secondDecode.map((server) => ({
    embedId: 'viper',  // ID of the embed scraper to handle this URL
    url: `https://embed.su/api/e/${server.hash}`,
  }));

  ctx.progress(90);

  return { embeds };
}

// Export the scraper configuration
export const embedsuScraper = makeSourcerer({
  id: 'embedsu',              // Unique identifier
  name: 'embed.su',           // Display name
  rank: 165,                  // Priority rank (must be unique)
  disabled: false,            // Whether the scraper is disabled
  flags: [],                  // Feature flags (see Advanced Concepts)
  scrapeMovie: comboScraper,  // Function for movies
  scrapeShow: comboScraper,   // Function for TV shows
});
```

Copy to clipboard

### [Alternative: Separate Functions](/in-depth/building-scrapers#alternative-separate-functions)

For complex cases where movie and TV show logic differs significantly. However, its best to use combo scraper!

```
async function scrapeMovie(ctx: MovieScrapeContext): Promise<SourcererOutput> {
  // Movie-specific logic
  const movieUrl = `${baseUrl}/movie/${ctx.media.tmdbId}`;
  // ... movie processing
}

async function scrapeShow(ctx: ShowScrapeContext): Promise<SourcererOutput> {
  // TV show-specific logic  
  const showUrl = `${baseUrl}/tv/${ctx.media.tmdbId}/${ctx.media.season.number}/${ctx.media.episode.number}`;
  // ... show processing
}

export const myScraper = makeSourcerer({
  id: 'my-scraper',
  name: 'My Scraper',
  rank: 150,
  disabled: false,
  flags: [],
  scrapeMovie: scrapeMovie,    // Separate functions
  scrapeShow: scrapeShow,
});
```

Copy to clipboard

## [Return Types](/in-depth/building-scrapers#return-types)

A `SourcererOutput` can return two types of data. Understanding when to use each is crucial:

### [1. Embeds Array (Most Common)](/in-depth/building-scrapers#_1-embeds-array-most-common)

Use when your scraper finds embed players that need further processing:

```
return { 
  embeds: [
    {
      embedId: 'turbovid',  // Must match an existing embed scraper ID
      url: 'https://turbovid.com/embed/abc123'
    },
    {
      embedId: 'mixdrop',   // Backup option
      url: 'https://mixdrop.co/embed/def456'
    }
  ]
};
```

Copy to clipboard

**When to use:**

* Your scraper finds embed player URLs
* You want to leverage existing embed scrapers
* The site uses common players (turbovid, mixdrop, etc.)
* You want to provide multiple server options

### [2. Stream Array (Direct Streams)](/in-depth/building-scrapers#_2-stream-array-direct-streams)

Use when your scraper finds direct video streams that are ready to play:

```
import { flags } from '@/entrypoint/utils/targets';

// For HLS streams
return {
  embeds: [], // Can be empty when returning streams
  stream: [
    {
      id: 'primary',
      type: 'hls',
      playlist: streamUrl,
      flags: [flags.CORS_ALLOWED],
      captions: [], // Subtitle tracks (optional)
    }
  ]
};

// For MP4 files with a single quality
return {
    embeds: [],
    stream: [
      {
        id: 'primary',
        captions,
        qualities: {
          unknown: {
            type: 'mp4',
            url: streamUrl,
          },
        },
        type: 'file',
        flags: [flags.CORS_ALLOWED],
      },
    ],
  };

  // For MP4 files with multiple qualities:
  // It's recommended to return it using a function similar to this:

  const streams = Object.entries(data.streams).reduce((acc: Record<string, string>, [quality, url]) => {
    let qualityKey: number;
    if (quality === 'ORG') {
      // Only add unknown quality if it's an mp4 (handle URLs with query parameters)
      const urlPath = url.split('?')[0]; // Remove query parameters
      if (urlPath.toLowerCase().endsWith('.mp4')) {
        acc.unknown = url;
      }
      return acc;
    }
    if (quality === '4K') {
      qualityKey = 2160;
    } else {
      qualityKey = parseInt(quality.replace('P', ''), 10);
    }
    if (Number.isNaN(qualityKey) || acc[qualityKey]) return acc;
    acc[qualityKey] = url;
    return acc;
  }, {});

  // Filter qualities based on provider type
  const filteredStreams = Object.entries(streams).reduce((acc: Record<string, string>, [quality, url]) => {
    // Skip unknown for cached provider
    if (provider.useCacheUrl && quality === 'unknown') {
      return acc;
    }

    acc[quality] = url;
    return acc;
  }, {});
  
  // Returning each quality like so
  return {
    stream: [
      {
        id: 'primary',
        captions: [],
        qualities: {
          ...(filteredStreams[2160] && {
            '4k': {
              type: 'mp4',
              url: filteredStreams[2160],
            },
          }),
          ...(filteredStreams[1080] && {
            1080: {
              type: 'mp4',
              url: filteredStreams[1080],
            },
          }),
          ...(filteredStreams[720] && {
            720: {
              type: 'mp4',
              url: filteredStreams[720],
            },
          }),
          ...(filteredStreams[480] && {
            480: {
              type: 'mp4',
              url: filteredStreams[480],
            },
          }),
          ...(filteredStreams[360] && {
            360: {
              type: 'mp4',
              url: filteredStreams[360],
            },
          }),
          ...(filteredStreams.unknown && {
            unknown: {
              type: 'mp4',
              url: filteredStreams.unknown,
            },
          }),
        },
        type: 'file',
        flags: [flags.CORS_ALLOWED],
      },
    ],
  };
```

Copy to clipboard

**When to use:**

* Your scraper can extract direct video URLs
* The site provides its own player technology
* You need fine control over stream handling
* The streams don't require complex embed processing

## [Context and Utilities](/in-depth/building-scrapers#context-and-utilities)

The scraper context (`ctx`) provides everything you need for implementation:

### [Media Information](/in-depth/building-scrapers#media-information)

```
// Basic media info (always available)
ctx.media.title          // "Spirited Away"
ctx.media.type           // "movie" | "show"
ctx.media.tmdbId         // 129
ctx.media.releaseYear    // 2001
ctx.media.imdbId         // "tt0245429" (when available)

// For TV shows only (check ctx.media.type === 'show')
ctx.media.season.number  // 1
ctx.media.season.tmdbId  // Season TMDB ID
ctx.media.episode.number // 5
ctx.media.episode.tmdbId // Episode TMDB ID
```

Copy to clipboard

### [HTTP Client](/in-depth/building-scrapers#http-client)

```
// Always use proxiedFetcher for external requests to avoid CORS
const response = await ctx.proxiedFetcher<string>('https://example.com/api', {
  method: 'POST',
  headers: {
    'User-Agent': 'Mozilla/5.0...',
    'Referer': 'https://example.com'
  },
  body: JSON.stringify({ key: 'value' })
});

// For API calls with base URL
const data = await ctx.proxiedFetcher('/search', {
  baseUrl: 'https://api.example.com',
  query: { q: ctx.media.title, year: ctx.media.releaseYear }
});
```

Copy to clipboard

### [Progress Updates](/in-depth/building-scrapers#progress-updates)

```
// Update the loading indicator (0-100)
ctx.progress(25);  // Found media page
// ... processing ...
ctx.progress(50);  // Extracted embed links
// ... more processing ...
ctx.progress(90);  // Almost done
```

Copy to clipboard

## [Common Patterns](/in-depth/building-scrapers#common-patterns)

### [1. URL Building](/in-depth/building-scrapers#_1-url-building)

```
// Handle different media types
const buildUrl = (ctx: ShowScrapeContext | MovieScrapeContext) => {
  const apiUrl = ctx.media.type === 'movie'
    ? `${baseUrl}/movie/${ctx.media.tmdbId}`
    : `${baseUrl}/tv/${ctx.media.tmdbId}/${ctx.media.season.number}/${ctx.media.episode.number}`;
    
  return apiUrl;
};
```

Copy to clipboard

### [2. Data Extraction](/in-depth/building-scrapers#_2-data-extraction)

```
import { load } from 'cheerio';

// Scraping with Cheerio
const $ = load(embedPage);
const embedUrls = $('iframe[src*="turbovid"]')
  .map((_, el) => $(el).attr('src'))
  .get()
  .filter(Boolean);

// Regex extraction
const configMatch = embedPage.match(/window\.playerConfig\s*=\s*({.*?});/s);
if (configMatch) {
  const config = JSON.parse(configMatch[1]);
  // Process config...
}
```

Copy to clipboard

### [3. Error Handling](/in-depth/building-scrapers#_3-error-handling)

```
import { NotFoundError } from '@/utils/errors';

// Throw NotFoundError for content not found
if (!embedUrls.length) {
  throw new NotFoundError('No embed players found');
}

// Throw generic Error for other issues
if (!apiResponse.success) {
  throw new Error(`API request failed: ${apiResponse.message}`);
}
```

Copy to clipboard

### [4. Protected Streams](/in-depth/building-scrapers#_4-protected-streams)

There are several ways to bypass protections on streams.

Using the M3U8 proxy:

```
import { createM3U8ProxyUrl } from '@/utils/proxy';

// For streams that require special headers
const streamHeaders = {
  'Referer': 'https://player.example.com/',
  'Origin': 'https://player.example.com',
  'User-Agent': 'Mozilla/5.0...'
};

return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: createM3U8ProxyUrl(originalPlaylist, ctx.features, streamHeaders),
    headers: streamHeaders, // Include headers in the createM3U8ProxyUrl function and here for native and extension targets
    flags: [flags.CORS_ALLOWED], // createM3U8ProxyUrl (or the extension) bypasses cors so we say it's allowed to play in a browser
    captions: []
  }]
};
```

Copy to clipboard

Using the browser extension:

```
// For streams that require special headers
const streamHeaders = {
  'Referer': 'https://player.example.com/',
  'Origin': 'https://player.example.com',
  'User-Agent': 'Mozilla/5.0...'
};

return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: originalPlaylist,
    headers: streamHeaders,
    flags: [], // Use the extension becuase it can pass headers, include no flag for extension or native
    captions: []
  }]
};
```

Copy to clipboard

## [Building Embed Scrapers](/in-depth/building-scrapers#building-embed-scrapers)

Embed scrapers follow a simpler pattern since they only handle one URL type:

```
import { makeEmbed } from '@/providers/base';

export const myEmbedScraper = makeEmbed({
  id: 'my-embed',
  name: 'My Embed Player',
  rank: 120,
  async scrape(ctx) {
    // ctx.url contains the embed URL from a source
    
    // 1. Fetch the embed page
    const embedPage = await ctx.proxiedFetcher(ctx.url);
    
    // 2. Extract the stream URL (example with regex)
    const streamMatch = embedPage.match(/src:\s*["']([^"']+\.m3u8[^"']*)/);
    if (!streamMatch) {
      throw new NotFoundError('No stream found in embed');
    }
    
    // 3. Return the stream
    return {
      stream: [{
        id: 'primary',
        type: 'hls',
        playlist: streamMatch[1],
        flags: [flags.CORS_ALLOWED],
        captions: []
      }]
    };
  },
});
```

Copy to clipboard

## [Testing Your Scrapers](/in-depth/building-scrapers#testing-your-scrapers)

### [1. Basic Testing](/in-depth/building-scrapers#_1-basic-testing)

```
# Test your scraper with CLI
pnpm cli --source-id my-scraper --tmdb-id 11527

# Test different content types
pnpm cli --source-id my-scraper --tmdb-id 94605 --season 1 --episode 1  # TV show
```

Copy to clipboard

### [2. Real CLI Output Examples](/in-depth/building-scrapers#_2-real-cli-output-examples)

**Testing a source that returns embeds:**

```
pnpm cli --source-id catflix --tmdb-id 11527
```

Copy to clipboard

```
{
  embeds: [
    {
      embedId: 'turbovid',
      url: 'https://turbovid.eu/embed/DjncbDBEmbLW'
    }
  ]
}
```

Copy to clipboard

**Testing an embed that returns streams:**

```
pnpm cli --source-id turbovid --url "https://turbovid.eu/embed/DjncbDBEmbLW"
```

Copy to clipboard

```
{
  stream: [
    {
      type: 'hls',
      id: 'primary',
      playlist: 'https://proxy.fifthwit.net/m3u8-proxy?url=https%3A%2F%2Fqueenselti.pro%2Fwrofm%2Fuwu.m3u8&headers=%7B%22referer%22%3A%22https%3A%2F%2Fturbovid.eu%2F%22%2C%22origin%22%3A%2F%2Fturbovid.eu%22%7D',
      flags: [flags.CORS_ALLOWED],
      captions: []
    }
  ]
}
```

Copy to clipboard

**Notice**: The playlist URL shows how `createM3U8ProxyUrl()` creates proxied URLs to handle protected streams.

### [3. Comprehensive Testing](/in-depth/building-scrapers#_3-comprehensive-testing)

Test with various content:

* Popular movies (The Shining: 11527, Spirited Away: 129, Avatar: 19995)
* Recent releases (check current popular movies)
* TV shows with multiple seasons
* Anime series (different episode numbering)
* Different languages/regions

### [4. Debug Mode](/in-depth/building-scrapers#_4-debug-mode)

```
# Add debug logging to your scraper
console.log('Fetching URL:', embedUrl);
console.log('Response status:', response.status);
console.log('Extracted data:', extractedData);
```

Copy to clipboard

## [Next Steps](/in-depth/building-scrapers#next-steps)

Once you've built your scraper:

1. Test thoroughly with multiple content types
2. Check [Advanced Concepts](/in-depth/advanced-concepts) for flags and error handling
3. Register in `all.ts` with a unique rank
4. Submit a pull request with testing documentation

Always test your scrapers with both movies and TV shows, and include multiple examples in your pull request description.

[In DepthProvider System Overview](/in-depth/provider-system)[In DepthSources vs Embeds](/in-depth/sources-and-embeds)

Table of Contents

Table of Contents

* [The Combo Scraper Pattern](#the-combo-scraper-pattern)
  + [Basic Structure](#basic-structure)
  + [Alternative: Separate Functions](#alternative-separate-functions)
* [Return Types](#return-types)
  + [1. Embeds Array (Most Common)](#_1-embeds-array-most-common)
  + [2. Stream Array (Direct Streams)](#_2-stream-array-direct-streams)
* [Context and Utilities](#context-and-utilities)
  + [Media Information](#media-information)
  + [HTTP Client](#http-client)
  + [Progress Updates](#progress-updates)
* [Common Patterns](#common-patterns)
  + [1. URL Building](#_1-url-building)
  + [2. Data Extraction](#_2-data-extraction)
  + [3. Error Handling](#_3-error-handling)
  + [4. Protected Streams](#_4-protected-streams)
* [Building Embed Scrapers](#building-embed-scrapers)
* [Testing Your Scrapers](#testing-your-scrapers)
  + [1. Basic Testing](#_1-basic-testing)
  + [2. Real CLI Output Examples](#_2-real-cli-output-examples)
  + [3. Comprehensive Testing](#_3-comprehensive-testing)
  + [4. Debug Mode](#_4-debug-mode)
* [Next Steps](#next-steps)
---

<a name='indepthsetupandprerequisites'></a>
# 📂 PATH: /in-depth/setup-and-prerequisites
**Source:** https://providers.pstream.mov/in-depth/setup-and-prerequisites

Setup and Prerequisites · @p-stream/providers

# [Setup and Prerequisites](/in-depth/setup-and-prerequisites#setup-and-prerequisites)

Before you start building scrapers, you need to set up your development environment and understand the testing workflow.

## [Environment Setup](/in-depth/setup-and-prerequisites#environment-setup)

### [1. Create Environment File](/in-depth/setup-and-prerequisites#_1-create-environment-file)

Create a `.env` file in the root of the repository with the following variables:

```
MOVIE_WEB_TMDB_API_KEY = "your_tmdb_api_key_here"
MOVIE_WEB_PROXY_URL = "https://your-proxy-url.com"  # Optional
```

Copy to clipboard

**Getting a TMDB API Key:**

1. Create an account at [TheMovieDB](https://www.themoviedb.org/)
2. Go to Settings > API
3. Request an API key (choose "Developer" for free usage)
4. Use the provided key in your `.env` file

**Proxy URL (Optional):**

* Useful for testing scrapers that require proxy access
* Can help bypass geographical restrictions during development
* If not provided, the library will use default proxy services

### [2. Install Dependencies](/in-depth/setup-and-prerequisites#_2-install-dependencies)

Install all required dependencies:

```
pnpm install
```

Copy to clipboard

## [Familiarize Yourself with the CLI](/in-depth/setup-and-prerequisites#familiarize-yourself-with-the-cli)

The library provides a CLI tool that's essential for testing scrapers during development. Unit tests can't be made for scrapers due to their unreliable nature, so the CLI is your primary testing tool.

### [Interactive Mode](/in-depth/setup-and-prerequisites#interactive-mode)

The easiest way to test is using interactive mode:

```
pnpm cli
```

Copy to clipboard

This will prompt you for:

* **Fetcher mode** (native, node-fetch, browser)
* **Scraper ID** (source or embed)
* **TMDB ID** for the content (for sources)
* **Embed URL** (for testing embeds directly)
* **Season/episode numbers** (for TV shows)

### [Command Line Mode](/in-depth/setup-and-prerequisites#command-line-mode)

For repeatability and automation, you can specify arguments directly:

```
# Get help with all available options
pnpm cli --help

# Test a movie scraper
pnpm cli --source-id catflix --tmdb-id 11527

# Test a TV show scraper (Arcane S1E1)
pnpm cli --source-id zoechip --tmdb-id 94605 --season 1 --episode 1

# Test an embed scraper directly with a URL
pnpm cli --source-id turbovid --url "https://turbovid.eu/embed/DjncbDBEmbLW"
```

Copy to clipboard

### [Common CLI Examples](/in-depth/setup-and-prerequisites#common-cli-examples)

```
# Popular test cases
pnpm cli --source-id catflix --tmdb-id 11527        # The Shining
pnpm cli --source-id embedsu --tmdb-id 129          # Spirited Away
pnpm cli --source-id vidsrc --tmdb-id 94605 --season 1 --episode 1    # Arcane S1E1

# Testing different fetcher modes
pnpm cli --fetcher native --source-id catflix --tmdb-id 11527
pnpm cli --fetcher browser --source-id catflix --tmdb-id 11527
```

Copy to clipboard

### [Fetcher Options](/in-depth/setup-and-prerequisites#fetcher-options)

The CLI supports different fetcher modes:

* **`native`**: Uses Node.js built-in fetch (undici) - fastest
* **`node-fetch`**: Uses the node-fetch library
* **`browser`**: Starts headless Chrome for browser-like environment

The browser fetcher requires running `pnpm build` first, otherwise you'll get outdated results.

### [Understanding CLI Output](/in-depth/setup-and-prerequisites#understanding-cli-output)

#### [Source Scraper Output (Returns Embeds)](/in-depth/setup-and-prerequisites#source-scraper-output-returns-embeds)

```
pnpm cli --source-id catflix --tmdb-id 11527
```

Copy to clipboard

Example output:

```
{
  embeds: [
    {
      embedId: 'turbovid',
      url: 'https://turbovid.eu/embed/DjncbDBEmbLW'
    }
  ]
}
```

Copy to clipboard

#### [Embed Scraper Output (Returns Streams)](/in-depth/setup-and-prerequisites#embed-scraper-output-returns-streams)

```
pnpm cli --source-id turbovid --url "https://turbovid.eu/embed/DjncbDBEmbLW"
```

Copy to clipboard

Example output:

```
{
  stream: [
    {
      type: 'hls',
      id: 'primary',
      playlist: 'https://proxy.fifthwit.net/m3u8-proxy?url=https%3A%2F%2Fqueenselti.pro%2Fwrofm%2Fuwu.m3u8&headers=%7B%22referer%22%3A%22https%3A%2F%2Fturbovid.eu%2F%22%2C%22origin%22%3A%22https%3A%2F%2Fturbovid.eu%22%7D',
      flags: [],
      captions: []
    }
  ]
}
```

Copy to clipboard

**Notice the proxied URL**: The `createM3U8ProxyUrl()` function creates URLs like `https://proxy.fifthwit.net/m3u8-proxy?url=...&headers=...` to handle protected streams. Read more about this in [Advanced Concepts](/in-depth/advanced-concepts).

#### [Interactive Mode Flow](/in-depth/setup-and-prerequisites#interactive-mode-flow)

```
pnpm cli
```

Copy to clipboard

```
✔ Select a fetcher mode · native
✔ Select a source · catflix  
✔ TMDB ID · 11527
✔ Media type · movie
✓ Done!
{
  embeds: [
    {
      embedId: 'turbovid',
      url: 'https://turbovid.eu/embed/DjncbDBEmbLW'
    }
  ]
}
```

Copy to clipboard

## [Development Workflow](/in-depth/setup-and-prerequisites#development-workflow)

1. **Setup**: Create `.env` file and install dependencies
2. **Research**: Study the target website's structure and player technology
3. **Code**: Build your scraper following the established patterns
4. **Register**: Add to `all.ts` with unique rank
5. **Test**: Use CLI to test with multiple different movies and TV shows
6. **Iterate**: Fix issues and improve reliability
7. **Submit**: Create pull request with thorough testing documentation

## [Next Steps](/in-depth/setup-and-prerequisites#next-steps)

Once your environment is set up:

1. Read [Provider System Overview](/in-depth/provider-system) to understand how scrapers work
2. Learn [Building Scrapers](/in-depth/building-scrapers) for detailed implementation guide
3. Check [Advanced Concepts](/in-depth/advanced-concepts) for error handling and best practices

Always test your scrapers with multiple different movies and TV shows to ensure reliability across different content types.

[In DepthDevelopment Guide](/in-depth/development)[In DepthProvider System Overview](/in-depth/provider-system)

Table of Contents

Table of Contents

* [Environment Setup](#environment-setup)
  + [1. Create Environment File](#_1-create-environment-file)
  + [2. Install Dependencies](#_2-install-dependencies)
* [Familiarize Yourself with the CLI](#familiarize-yourself-with-the-cli)
  + [Interactive Mode](#interactive-mode)
  + [Command Line Mode](#command-line-mode)
  + [Common CLI Examples](#common-cli-examples)
  + [Fetcher Options](#fetcher-options)
  + [Understanding CLI Output](#understanding-cli-output)
* [Development Workflow](#development-workflow)
* [Next Steps](#next-steps)
---

<a name='indepthprovidersystem'></a>
# 📂 PATH: /in-depth/provider-system
**Source:** https://providers.pstream.mov/in-depth/provider-system

Provider System Overview · @p-stream/providers

# [Provider System Overview](/in-depth/provider-system#provider-system-overview)

Understanding how the provider system works is crucial for building effective scrapers.

## [The all.ts Registration System](/in-depth/provider-system#the-allts-registration-system)

All scrapers must be registered in `src/providers/all.ts`. This central file exports two main functions that gather all available providers:

```
// src/providers/all.ts
import { Embed, Sourcerer } from '@/providers/base';
import { embedsuScraper } from './sources/embedsu';
import { turbovidScraper } from './embeds/turbovid';

export function gatherAllSources(): Array<Sourcerer> {
  return [
    cuevana3Scraper,
    catflixScraper,
    embedsuScraper,    // Your source scraper goes here
    // ... more sources
  ];
}

export function gatherAllEmbeds(): Array<Embed> {
  return [
    upcloudScraper,
    turbovidScraper,   // Your embed scraper goes here
    // ... more embeds
  ];
}
```

Copy to clipboard

**Why this matters:**

* Only registered scrapers are available to the library
* The order in these arrays doesn't matter (ranking determines priority)
* You must import your scraper and add it to the appropriate function

## [Provider Types](/in-depth/provider-system#provider-types)

There are two distinct types of providers in the system:

### [Sources (Primary Scrapers)](/in-depth/provider-system#sources-primary-scrapers)

**Sources** find content on websites and return either:

* **Direct video streams** (ready to play immediately)
* **Embed URLs** that need further processing by embed scrapers

**Characteristics:**

* Handle website navigation and search
* Process TMDB IDs to find content
* Can return multiple server options
* Located in `src/providers/sources/`

**Example source workflow:**

1. Receive movie/show request with TMDB ID
2. Search the target website for that content
3. Extract embed player URLs or direct streams
4. Return results for further processing

### [Embeds (Secondary Scrapers)](/in-depth/provider-system#embeds-secondary-scrapers)

**Embeds** extract playable video streams from embed players:

* Take URLs from sources as input
* Handle player-specific extraction and decryption
* Always return direct streams (never more embeds)

**Characteristics:**

* Focus on one player type (turbovid, mixdrop, etc.)
* Handle complex decryption/obfuscation
* Specialized for specific player technologies
* Located in `src/providers/embeds/`

**Example embed workflow:**

1. Receive embed player URL from a source
2. Fetch and parse the embed page
3. Extract/decrypt the video stream URLs
4. Return playable HLS or MP4 streams

## [Ranking System](/in-depth/provider-system#ranking-system)

Every scraper has a **rank** that determines its priority in the execution queue:

### [How Ranking Works](/in-depth/provider-system#how-ranking-works)

* **Higher numbers = Higher priority** (processed first)
* **Each rank must be unique** across all providers
* Sources and embeds have separate ranking spaces
* Failed scrapers are skipped, next rank is tried

### [Rank Ranges](/in-depth/provider-system#rank-ranges)

Usually ranks should be on 10s: 110, 120, 130...

```
// Typical rank ranges (not enforced, but conventional)
Sources:  1-300
Embeds:   1-250

// Example rankings
export const embedsuScraper = makeSourcerer({
  id: 'embedsu',
  rank: 165,    // Medium priority source
  // ...
});

export const turbovidScraper = makeEmbed({
  id: 'turbovid', 
  rank: 122,    // Medium priority embed
  // ...
});
```

Copy to clipboard

### [Choosing a Rank](/in-depth/provider-system#choosing-a-rank)

**For Sources:**

* **200+**: High-quality, reliable sources (fast APIs, good uptime)
* **100-199**: Medium reliability sources (most scrapers fall here)
* **1-99**: Lower priority or experimental sources

**For Embeds:**

* **200+**: Fast, reliable embeds (direct URLs, minimal processing)
* **100-199**: Standard embeds (typical decryption/extraction)
* **1-99**: Slow or unreliable embeds (complex decryption, poor uptime)

### [Finding Available Ranks](/in-depth/provider-system#finding-available-ranks)

Before choosing a rank, check what's already taken:

```
# Search for existing ranks
grep -r "rank:" src/providers/ | sort -t: -k3 -n
```

Copy to clipboard

Or check the cli to see the ranks.

**Duplicate ranks will cause conflicts!** Always verify your chosen rank is unique before submitting.

## [Provider Configuration](/in-depth/provider-system#provider-configuration)

Each provider is configured using `makeSourcerer()` or `makeEmbed()`:

### [Source Configuration](/in-depth/provider-system#source-configuration)

```
export const mySourceScraper = makeSourcerer({
  id: 'my-source',           // Unique identifier (kebab-case)
  name: 'My Source',         // Display name (human-readable)
  rank: 150,                 // Priority rank (must be unique)
  disabled: false,           // Whether scraper is disabled
  flags: [],                 // Feature flags (see Advanced Concepts)
  scrapeMovie: comboScraper, // Function for movies
  scrapeShow: comboScraper,  // Function for TV shows
});
```

Copy to clipboard

### [Embed Configuration](/in-depth/provider-system#embed-configuration)

```
export const myEmbedScraper = makeEmbed({
  id: 'my-embed',            // Unique identifier (kebab-case)
  name: 'My Embed',          // Display name (human-readable)
  rank: 120,                 // Priority rank (must be unique)
  disabled: false,           // Whether scraper is disabled
  async scrape(ctx) {        // Single scrape function for embeds
    // ... extraction logic
    return { stream: [...] };
  },
});
```

Copy to clipboard

## [How Providers Work Together](/in-depth/provider-system#how-providers-work-together)

The provider system creates a powerful pipeline:

### [1. Source → Embed Chain](/in-depth/provider-system#_1-source-embed-chain)

```
User Request → Source Scraper → Embed URLs → Embed Scraper → Video Stream → Player
```

Copy to clipboard

**Pipeline Steps:**

1. **User Request** - User wants to watch content
2. **Source Scraper** - Finds content on websites
3. **Embed URLs** - Returns player URLs that need processing
4. **Embed Scraper** - Extracts streams from player URLs
5. **Video Stream** - Final playable stream
6. **Player** - User watches the content

### [2. Multiple Server Options](/in-depth/provider-system#_2-multiple-server-options)

Sources can provide multiple backup servers:

```
// Source returns multiple embed options
return {
  embeds: [
    { embedId: 'turbovid', url: 'https://turbovid.com/abc' },
    { embedId: 'mixdrop', url: 'https://mixdrop.co/def' },
    { embedId: 'dood', url: 'https://dood.watch/ghi' }
  ]
};
```

Copy to clipboard

### [3. Fallback System](/in-depth/provider-system#_3-fallback-system)

If one embed fails, the system tries the next:

1. Try turbovid embed (rank 122)
2. If fails, try mixdrop embed (rank 198)
3. If fails, try dood embed (rank 173)
4. Continue until success or all options exhausted

## [Best Practices](/in-depth/provider-system#best-practices)

### [Naming Conventions](/in-depth/provider-system#naming-conventions)

* **IDs**: Use kebab-case (`my-scraper`, not `myMyscraper` or `My_Scraper`)
* **Names**: Use proper capitalization (`VidCloud`, not `vidcloud` or `VIDCLOUD`)
* **Files**: Match the ID (`my-scraper.ts` for ID `my-scraper`)

### [Registration Order](/in-depth/provider-system#registration-order)

* The order in `all.ts` arrays doesn't affect execution (rank does)
* Group similar scrapers together for maintainability
* Add imports at the top, organized logically

### [Testing Integration](/in-depth/provider-system#testing-integration)

Always test that your registration works:

```
# Verify your scraper appears in the list (interactive mode shows all available)
pnpm cli

# Test your specific scraper
pnpm cli --source-id my-scraper --tmdb-id 11527
```

Copy to clipboard

## [Next Steps](/in-depth/provider-system#next-steps)

Now that you understand the provider system:

1. Learn the details in [Building Scrapers](/in-depth/building-scrapers)
2. Study [Advanced Concepts](/in-depth/advanced-concepts) for flags and error handling
3. Look at the [Sources vs Embeds](/in-depth/sources-and-embeds) guide for more examples

[In DepthSetup and Prerequisites](/in-depth/setup-and-prerequisites)[In DepthBuilding Scrapers](/in-depth/building-scrapers)

Table of Contents

Table of Contents

* [The all.ts Registration System](#the-allts-registration-system)
* [Provider Types](#provider-types)
  + [Sources (Primary Scrapers)](#sources-primary-scrapers)
  + [Embeds (Secondary Scrapers)](#embeds-secondary-scrapers)
* [Ranking System](#ranking-system)
  + [How Ranking Works](#how-ranking-works)
  + [Rank Ranges](#rank-ranges)
  + [Choosing a Rank](#choosing-a-rank)
  + [Finding Available Ranks](#finding-available-ranks)
* [Provider Configuration](#provider-configuration)
  + [Source Configuration](#source-configuration)
  + [Embed Configuration](#embed-configuration)
* [How Providers Work Together](#how-providers-work-together)
  + [1. Source → Embed Chain](#_1-source-embed-chain)
  + [2. Multiple Server Options](#_2-multiple-server-options)
  + [3. Fallback System](#_3-fallback-system)
* [Best Practices](#best-practices)
  + [Naming Conventions](#naming-conventions)
  + [Registration Order](#registration-order)
  + [Testing Integration](#testing-integration)
* [Next Steps](#next-steps)
---

<a name='indepthadvancedconcepts'></a>
# 📂 PATH: /in-depth/advanced-concepts
**Source:** https://providers.pstream.mov/in-depth/advanced-concepts

Advanced Concepts · @p-stream/providers

# [Advanced Concepts](/in-depth/advanced-concepts#advanced-concepts)

This guide covers advanced topics for building robust and reliable scrapers.

## [Stream Protection and Proxying](/in-depth/advanced-concepts#stream-protection-and-proxying)

Modern streaming services use various protection mechanisms.

### [Common Protections](/in-depth/advanced-concepts#common-protections)

1. **Referer Checking** - URLs only work from specific domains
2. **CORS Restrictions** - Prevent browser access from unauthorized origins
3. **Geographic Blocking** - IP-based access restrictions
4. **Time-Limited Tokens** - URLs expire after short periods
5. **User-Agent Filtering** - Only allow specific browsers/clients

### [Handling Protected Streams](/in-depth/advanced-concepts#handling-protected-streams)

**Convert HLS playlists to data URLs:**

Data URLs embed content directly in the URL using base64 encoding, completely bypassing CORS restrictions since no HTTP request is made to a different origin. This is often the most effective solution for HLS streams.

```
import { convertPlaylistsToDataUrls } from '@/utils/playlist';

// Original playlist URL from streaming service
const playlistUrl = 'https://protected-cdn.example.com/playlist.m3u8';

// Headers required to access the playlist
const headers = {
  'Referer': 'https://player.example.com/',
  'Origin': 'https://player.example.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

// Convert playlist and all variants to data URLs
const dataUrl = await convertPlaylistsToDataUrls(
  ctx.proxiedFetcher,
  playlistUrl,
  headers
);

return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: dataUrl, // Self-contained data URL
    flags: [flags.CORS_ALLOWED], // No CORS issues with data URLs
    captions: []
  }]
};
```

Copy to clipboard

**Why data URLs work for CORS bypass:**

* **Inital proxied request WITH HEADERS**: A request is sent from the proxy *with* headers allowing for the playlist to load
* **Fewer external requests**: Content is embedded directly in the URL as base64
* **Same-origin**: Browsers treat data URLs as same-origin content
* **Complete isolation**: No network requests means no CORS preflight checks
* **Self-contained**: All playlist data and segments are embedded in the response

**How the conversion works:**

1. Fetches the master playlist using provided headers
2. For each quality variant, fetches the variant playlist
3. Converts all playlists to base64-encoded data URLs
4. Returns a master data URL containing all embedded variants

**When to use data URLs vs M3U8 proxy:**

* **Use data URLs** when you can fetch all playlist data upfront
* **Use M3U8 proxy** when playlists are too large or change frequently
* **Data URLs are preferred** for most HLS streams due to simplicity and reliability
* **Each segment is origin or header locked**: converting to a data URL does not apply the headers to the segments

**Use M3U8 proxy for HLS streams:**

Using the createM3U8ProxyUrl function we can use our configured M3U8 proxy to send headers to the playlist and all it's segments.

**When the target is browser-extension or native, then the createM3U8ProxyUrl function will return an unproxied url. It ONLY converts for vanilla browser targets to bypass CORS.** This is why you need to also include the headers item in the stream response rather than in just the function.

```
import { createM3U8ProxyUrl } from '@/utils/proxy';

// Extract the original stream URL
const originalPlaylist = 'https://protected-cdn.example.com/playlist.m3u8';

// Headers required by the streaming service
const streamHeaders = {
  'Referer': 'https://player.example.com/',
  'Origin': 'https://player.example.com',
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
};

return {
  stream: [{
    id: 'primary',
    type: 'hls',
    playlist: createM3U8ProxyUrl(originalPlaylist, ctx.features, streamHeaders), // Include headers for proxy usage
    headers: streamHeaders, // Include headers for extension/native usage
    flags: [flags.CORS_ALLOWED], // Proxy enables CORS for all targets
    captions: []
  }]
};
```

Copy to clipboard

### [Stream Validation Bypass](/in-depth/advanced-concepts#stream-validation-bypass)

Streams are checked with a proxied fetcher before returning. However, some streams may be blocked by proxies, so you may need to bypass automatic stream validation in `valid.ts`:

```
// In src/utils/valid.ts, add your scraper ID to skip validation
const SKIP_VALIDATION_CHECK_IDS = [
  // ... existing IDs
  'your-scraper-id', // Add your scraper ID here
];

// Sources here are always proxied, so we dont need to validate with a proxy, but we should fetch nativly
// NOTE: all m3u8 proxy urls are automatically processed using this method, so no need to add them here manually
const UNPROXIED_VALIDATION_CHECK_IDS = [
    // ... existing IDs
  'your-scraper-id', // Add your scraper ID here
];
```

Copy to clipboard

**Why this is needed:**

* By default, all streams are validated by attempting to fetch metadata
* The validation uses `proxiedFetcher` to check if streams are playable
* If the stream blocks the fetcher, validation will fail
* But the proxied URL should still work in the actual player context
* Adding to skip list bypasses validation and returns the proxied URL directly without checking it

**When to skip validation:**

* Validation consistently fails but streams work in browsers
* The stream may be origin or IP locked
* The stream blocks the extension or proxy

**Use setupProxy for MP4 streams:**
When adding headers in the stream response, usually may need to use the **extension** or native to send the correct headers in the request.

```
import { setupProxy } from '@/utils/proxy';

let stream = {
  id: 'primary',
  type: 'file',
  flags: [],
  qualities: {
    '1080p': { url: 'https://protected-cdn.example.com/video.mp4' }
  },
  headers: {
    'Referer': 'https://player.example.com/',
    'User-Agent': 'Mozilla/5.0...'
  },
  captions: []
};

// setupProxy will handle proxying if needed
stream = setupProxy(stream);

return { stream: [stream] };
```

Copy to clipboard

## [Performance Optimization](/in-depth/advanced-concepts#performance-optimization)

### [Efficient Data Extraction](/in-depth/advanced-concepts#efficient-data-extraction)

**Use targeted selectors:**

```
// ✅ Good - specific selector
const embedUrl = $('iframe[src*="turbovid"]').attr('src');

// ❌ Bad - searches entire document
const embedUrl = $('*').filter((_, el) => $(el).attr('src')?.includes('turbovid')).attr('src');
```

Copy to clipboard

**Cache expensive operations:**

```
// Cache parsed data to avoid re-parsing
let cachedConfig;
if (!cachedConfig) {
  cachedConfig = JSON.parse(configString);
}
```

Copy to clipboard

### [Minimize HTTP Requests](/in-depth/advanced-concepts#minimize-http-requests)

**Combine operations when possible:**

```
// ✅ Good - single request with full processing
const embedPage = await ctx.proxiedFetcher(embedUrl);
const streams = extractAllStreams(embedPage);

// ❌ Bad - multiple requests for same page
const page1 = await ctx.proxiedFetcher(embedUrl);
const config = extractConfig(page1);
const page2 = await ctx.proxiedFetcher(embedUrl); // Duplicate request
const streams = extractStreams(page2);
```

Copy to clipboard

## [Security Considerations](/in-depth/advanced-concepts#security-considerations)

### [Input Validation](/in-depth/advanced-concepts#input-validation)

**Validate external data:**

```
// Validate URLs before using them
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return url.startsWith('http://') || url.startsWith('https://');
  } catch {
    return false;
  }
};

if (!isValidUrl(streamUrl)) {
  throw new Error('Invalid stream URL received');
}
```

Copy to clipboard

**Sanitize regex inputs:**

```
// Be careful with dynamic regex
const safeTitle = ctx.media.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const titleRegex = new RegExp(safeTitle, 'i');
```

Copy to clipboard

### [Safe JSON Parsing](/in-depth/advanced-concepts#safe-json-parsing)

```
// Handle malformed JSON gracefully
let config;
try {
  config = JSON.parse(configString);
} catch (error) {
  throw new Error('Invalid configuration format');
}

// Validate expected structure
if (!config || typeof config !== 'object' || !config.streams) {
  throw new Error('Invalid configuration structure');
}
```

Copy to clipboard

## [Testing and Debugging](/in-depth/advanced-concepts#testing-and-debugging)

### [Debug Logging](/in-depth/advanced-concepts#debug-logging)

```
// Add temporary debug logs (remove before submitting)
console.log('Request URL:', requestUrl);
console.log('Response headers:', response.headers);
console.log('Extracted data:', extractedData);
```

Copy to clipboard

### [Test Edge Cases](/in-depth/advanced-concepts#test-edge-cases)

* Content with special characters in titles
* Very new releases (might not be available)
* Old content (might have different URL patterns)
* Different regions (geographic restrictions)
* Different quality levels

### [Common Debugging Steps](/in-depth/advanced-concepts#common-debugging-steps)

1. **Verify URLs are correct**
2. **Check HTTP status codes**
3. **Inspect response headers**
4. **Validate extracted data structure**
5. **Test with different content types**

## [Best Practices Summary](/in-depth/advanced-concepts#best-practices-summary)

1. **Always use `ctx.proxiedFetcher`** for external requests
2. **Throw `NotFoundError`** for content-not-found scenarios
3. **Update progress** at meaningful milestones
4. **Use appropriate flags** for stream capabilities
5. **Handle protected streams** with proxy functions
6. **Validate external data** before using it
7. **Test thoroughly** with diverse content
8. **Document your implementation** in pull requests

## [Next Steps](/in-depth/advanced-concepts#next-steps)

With these advanced concepts:

1. Review [Sources vs Embeds](/in-depth/sources-and-embeds) for architectural patterns
2. Study existing scrapers in `src/providers/` for real examples
3. Test your implementation thoroughly
4. Submit pull requests with detailed testing documentation

[In DepthFlags](/in-depth/flags)[Api ReferencemakeProviders](/api-reference/makeproviders)

Table of Contents

Table of Contents

* [Stream Protection and Proxying](#stream-protection-and-proxying)
  + [Common Protections](#common-protections)
  + [Handling Protected Streams](#handling-protected-streams)
  + [Stream Validation Bypass](#stream-validation-bypass)
* [Performance Optimization](#performance-optimization)
  + [Efficient Data Extraction](#efficient-data-extraction)
  + [Minimize HTTP Requests](#minimize-http-requests)
* [Security Considerations](#security-considerations)
  + [Input Validation](#input-validation)
  + [Safe JSON Parsing](#safe-json-parsing)
* [Testing and Debugging](#testing-and-debugging)
  + [Debug Logging](#debug-logging)
  + [Test Edge Cases](#test-edge-cases)
  + [Common Debugging Steps](#common-debugging-steps)
* [Best Practices Summary](#best-practices-summary)
* [Next Steps](#next-steps)
---

<a name='apireferencemakeproviders'></a>
# 📂 PATH: /api-reference/makeproviders
**Source:** https://providers.pstream.mov/api-reference/makeproviders

makeProviders · @p-stream/providers

# [`makeProviders`](/api-reference/makeproviders#makeproviders)

Make an instance of provider controls with configuration.
This is the main entry-point of the library. It is recommended to make one instance globally and reuse it throughout your application.

## [Example](/api-reference/makeproviders#example)

```
import { targets, makeProviders, makeDefaultFetcher } from '@p-stream/providers';

const providers = makeProviders({
  fetcher: makeDefaultFetcher(fetch),
  target: targets.NATIVE, // target native app streams
});
```

Copy to clipboard

## [Type](/api-reference/makeproviders#type)

```
function makeProviders(ops: ProviderBuilderOptions): ProviderControls;

interface ProviderBuilderOptions {
  // instance of a fetcher, all webrequests are made with the fetcher.
  fetcher: Fetcher;
  
  // instance of a fetcher, in case the request has CORS restrictions.
  // this fetcher will be called instead of normal fetcher.
  // if your environment doesn't have CORS restrictions (like Node.JS), there is no need to set this.
  proxiedFetcher?: Fetcher;

  // target to get streams for
  target: Targets;
}
```

Copy to clipboard

[In DepthAdvanced Concepts](/in-depth/advanced-concepts)[Api ReferenceProviderControls.runAll](/api-reference/providercontrolsrunall)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferenceprovidercontrolsrunsourcescraper'></a>
# 📂 PATH: /api-reference/providercontrolsrunsourcescraper
**Source:** https://providers.pstream.mov/api-reference/providercontrolsrunsourcescraper

ProviderControls.runSourceScraper · @p-stream/providers

# [`ProviderControls.runSourceScraper`](/api-reference/providercontrolsrunsourcescraper#providercontrolsrunsourcescraper)

Run a specific source scraper and get its emitted streams.

## [Example](/api-reference/providercontrolsrunsourcescraper#example)

```
import { SourcererOutput, NotFoundError } from '@p-stream/providers';

// media from TMDB
const media = {
  type: 'movie',
  title: 'Hamilton',
  releaseYear: 2020,
  tmdbId: '556574'
}

// scrape a stream from flixhq
let output: SourcererOutput;
try {
  output = await providers.runSourceScraper({
    id: 'flixhq',
    media: media,
  })
} catch (err) {
  if (err instanceof NotFoundError) {
    console.log('source does not have this media');
  } else {
    console.log('failed to scrape')
  }
  return;
}

if (!output.stream && output.embeds.length === 0) {
  console.log('no streams found');
}
```

Copy to clipboard

## [Type](/api-reference/providercontrolsrunsourcescraper#type)

```
function runSourceScraper(runnerOps: SourceRunnerOptions): Promise<SourcererOutput>;

interface SourceRunnerOptions {
  // object of event functions
  events?: IndividualScraperEvents;

  // the media you want to see sources from
  media: ScrapeMedia;

  // ID of the source scraper you want to scrape from
  id: string;
}

type SourcererOutput = {
  // list of embeds that the source scraper found.
  // embed ID is a reference to an embed scraper
  embeds: {
    embedId: string;
    url: string;
  }[];

  // the stream that the scraper found
  stream?: Stream;
};
```

Copy to clipboard

[Api ReferenceProviderControls.runAll](/api-reference/providercontrolsrunall)[Api ReferenceProviderControls.runEmbedScraper](/api-reference/providercontrolsrunembedscraper)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferenceprovidercontrolsrunembedscraper'></a>
# 📂 PATH: /api-reference/providercontrolsrunembedscraper
**Source:** https://providers.pstream.mov/api-reference/providercontrolsrunembedscraper

ProviderControls.runEmbedScraper · @p-stream/providers

# [`ProviderControls.runEmbedScraper`](/api-reference/providercontrolsrunembedscraper#providercontrolsrunembedscraper)

Run a specific embed scraper and get its emitted streams.

## [Example](/api-reference/providercontrolsrunembedscraper#example)

```
import { SourcererOutput } from '@p-stream/providers';

// scrape a stream from upcloud
let output: EmbedOutput;
try {
  output = await providers.runEmbedScraper({
    id: 'upcloud',
    url: 'https://example.com/123',
  })
} catch (err) {
  console.log('failed to scrape')
  return;
}

// output.stream now has your stream
```

Copy to clipboard

## [Type](/api-reference/providercontrolsrunembedscraper#type)

```
function runEmbedScraper(runnerOps: SourceRunnerOptions): Promise<EmbedOutput>;

interface EmbedRunnerOptions {
  // object of event functions
  events?: IndividualScraperEvents;

  // the embed URL
  url: string;

  // ID of the embed scraper you want to scrape from
  id: string;
}

type EmbedOutput = {
  stream: Stream;
};
```

Copy to clipboard

[Api ReferenceProviderControls.runSourceScraper](/api-reference/providercontrolsrunsourcescraper)[Api ReferenceProviderControls.listSources](/api-reference/providercontrolslistsources)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferenceprovidercontrolsrunall'></a>
# 📂 PATH: /api-reference/providercontrolsrunall
**Source:** https://providers.pstream.mov/api-reference/providercontrolsrunall

ProviderControls.runAll · @p-stream/providers

# [`ProviderControls.runAll`](/api-reference/providercontrolsrunall#providercontrolsrunall)

Run all providers one by one in order of their built-in ranking.
You can attach events if you need to know what is going on while it is processing.

## [Example](/api-reference/providercontrolsrunall#example)

(Use the cli to learn more specifics about inputs)

```
// media from TMDB
const media = {
  type: 'movie',         // "movie" | "show"
  title: 'Hamilton',
  tmdbId: '556574',
  // season: '1',
  // episode: '1'
}

// scrape a stream
const stream = await providers.runAll({
  media: media,
})

// scrape a stream, but prioritize flixhq above all
// (other scrapers are still run if flixhq fails, it just has priority)
const flixhqStream = await providers.runAll({
  media: media,
  sourceOrder: ['flixhq']
})
```

Copy to clipboard

## [Type](/api-reference/providercontrolsrunall#type)

```
function runAll(runnerOps: RunnerOptions): Promise<RunOutput | null>;

interface RunnerOptions {
  // overwrite the order of sources to run. List of IDs
  // any omitted IDs are added to the end in order of rank (highest first)
  sourceOrder?: string[];

  // overwrite the order of embeds to run. List of IDs
  // any omitted IDs are added to the end in order of rank (highest first)
  embedOrder?: string[];

  // object of event functions
  events?: FullScraperEvents;

  // the media you want to see sources from
  media: ScrapeMedia;
}

type RunOutput = {
  // source scraper ID
  sourceId: string;

  // if from an embed, this is the embed scraper ID
  embedId?: string;

  // the emitted stream
  stream: Stream;
};
```

Copy to clipboard

[Api ReferencemakeProviders](/api-reference/makeproviders)[Api ReferenceProviderControls.runSourceScraper](/api-reference/providercontrolsrunsourcescraper)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferenceprovidercontrolslistsources'></a>
# 📂 PATH: /api-reference/providercontrolslistsources
**Source:** https://providers.pstream.mov/api-reference/providercontrolslistsources

ProviderControls.listSources · @p-stream/providers

# [`ProviderControls.listSources`](/api-reference/providercontrolslistsources#providercontrolslistsources)

List all source scrapers that are applicable for the target.
They are sorted by rank; highest first

## [Example](/api-reference/providercontrolslistsources#example)

```
const sourceScrapers = providers.listSources();
// Guaranteed to only return the type: 'source'
```

Copy to clipboard

## [Type](/api-reference/providercontrolslistsources#type)

```
function listSources(): MetaOutput[];

type MetaOutput = {
  type: 'embed' | 'source';
  id: string;
  rank: number;
  name: string;
  mediaTypes?: Array<MediaTypes>;
};
```

Copy to clipboard

[Api ReferenceProviderControls.runEmbedScraper](/api-reference/providercontrolsrunembedscraper)[Api ReferenceProviderControls.listEmbeds](/api-reference/providercontrolslistembeds)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferenceprovidercontrolslistembeds'></a>
# 📂 PATH: /api-reference/providercontrolslistembeds
**Source:** https://providers.pstream.mov/api-reference/providercontrolslistembeds

ProviderControls.listEmbeds · @p-stream/providers

# [`ProviderControls.listEmbeds`](/api-reference/providercontrolslistembeds#providercontrolslistembeds)

List all embed scrapers that are applicable for the target.
They are sorted by rank; highest first

## [Example](/api-reference/providercontrolslistembeds#example)

```
const embedScrapers = providers.listEmbeds();
// Guaranteed to only return the type: 'embed'
```

Copy to clipboard

## [Type](/api-reference/providercontrolslistembeds#type)

```
function listEmbeds(): MetaOutput[];

type MetaOutput = {
  type: 'embed' | 'source';
  id: string;
  rank: number;
  name: string;
  mediaTypes?: Array<MediaTypes>;
};
```

Copy to clipboard

[Api ReferenceProviderControls.listSources](/api-reference/providercontrolslistsources)[Api ReferenceProviderControls.getMetadata](/api-reference/providercontrolsgetmetadata)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferencemakestandardfetcher'></a>
# 📂 PATH: /api-reference/makestandardfetcher
**Source:** https://providers.pstream.mov/api-reference/makestandardfetcher

makeStandardFetcher · @p-stream/providers

# [`makeStandardFetcher`](/api-reference/makestandardfetcher#makestandardfetcher)

Make a fetcher from a `fetch()` API. It is used for making an instance of provider controls.

## [Example](/api-reference/makestandardfetcher#example)

```
import { targets, makeProviders, makeDefaultFetcher } from '@p-stream/providers';

const providers = makeProviders({
  fetcher: makeStandardFetcher(fetch),
  target: targets.ANY,
});
```

Copy to clipboard

## [Type](/api-reference/makestandardfetcher#type)

```
function makeStandardFetcher(fetchApi: typeof fetch): Fetcher;
```

Copy to clipboard

[Api ReferenceProviderControls.getMetadata](/api-reference/providercontrolsgetmetadata)[Api ReferencemakeSimpleProxyFetcher](/api-reference/makesimpleproxyfetcher)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferencemakesimpleproxyfetcher'></a>
# 📂 PATH: /api-reference/makesimpleproxyfetcher
**Source:** https://providers.pstream.mov/api-reference/makesimpleproxyfetcher

makeSimpleProxyFetcher · @p-stream/providers

# [`makeSimpleProxyFetcher`](/api-reference/makesimpleproxyfetcher#makesimpleproxyfetcher)

Make a fetcher to use with [p-stream/simple-proxy](https://github.com/p-stream/simple-proxy). This is for making a proxiedFetcher, so you can run this library in the browser.

## [Example](/api-reference/makesimpleproxyfetcher#example)

```
import { targets, makeProviders, makeDefaultFetcher, makeSimpleProxyFetcher } from '@p-stream/providers';

const proxyUrl = 'https://your.proxy.workers.dev/'

const providers = makeProviders({
  fetcher: makeDefaultFetcher(fetch),
  proxiedFetcher: makeSimpleProxyFetcher(proxyUrl, fetch),
  target: targets.BROWSER,
});
```

Copy to clipboard

## [Type](/api-reference/makesimpleproxyfetcher#type)

```
function makeSimpleProxyFetcher(proxyUrl: string, fetchApi: typeof fetch): Fetcher;
```

Copy to clipboard

[Api ReferencemakeStandardFetcher](/api-reference/makestandardfetcher)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---

<a name='apireferenceprovidercontrolsgetmetadata'></a>
# 📂 PATH: /api-reference/providercontrolsgetmetadata
**Source:** https://providers.pstream.mov/api-reference/providercontrolsgetmetadata

ProviderControls.getMetadata · @p-stream/providers

# [`ProviderControls.getMetadata`](/api-reference/providercontrolsgetmetadata#providercontrolsgetmetadata)

Get meta data for a scraper, can be either source or embed scraper.
Returns `null` if the `id` is not recognized.

## [Example](/api-reference/providercontrolsgetmetadata#example)

```
const flixhqSource = providers.getMetadata('flixhq');
```

Copy to clipboard

## [Type](/api-reference/providercontrolsgetmetadata#type)

```
function getMetadata(id: string): MetaOutput | null;

type MetaOutput = {
  type: 'embed' | 'source';
  id: string;
  rank: number;
  name: string;
  mediaTypes?: Array<MediaTypes>;
};
```

Copy to clipboard

[Api ReferenceProviderControls.listEmbeds](/api-reference/providercontrolslistembeds)[Api ReferencemakeStandardFetcher](/api-reference/makestandardfetcher)

Table of Contents

Table of Contents

* [Example](#example)
* [Type](#type)
---
