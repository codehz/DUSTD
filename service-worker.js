/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["BasicUI.js","c7ae8f1d246d141468b979ef6fa3acb9"],["BasicUI.js.map","746819611d3e5c3dbf0b2610b0d801e2"],["BasicUI.ts","75f9c9dcdae0055e131af6efad15b5fd"],["Blocks.js","2e6790d77e8dcaf265f8a997ff7b181d"],["Blocks.js.map","8a8c679a22e119213bc3c8255411100a"],["Blocks.ts","a9081b6502e2591ae569d98c47e88388"],["Bullet.js","3049682ccb3160609bd0333fed8b9b3a"],["Bullet.js.map","5f198ebcb8d0b1824d2f4eb69260759f"],["Bullet.ts","eda5c1939da7ab2efd2d867b47c6c122"],["Enemy.js","bc8a18e483b2273376b65604a544594d"],["Enemy.js.map","93724d97892753da669f7af158580b41"],["Enemy.ts","feeb9e7f24ddfde9aa310bf695fcc697"],["FontLoader.js","b1b4139147afd96d51f9dec0253d19dd"],["FontLoader.js.map","60fe557669736128be1aba850c7af40f"],["FontLoader.ts","87ae1e02d5d8079e473c7740fb53ba02"],["GL.js","545a62fc49485ee771cb9f94ae4eaa57"],["GL.js.map","77eb56832af2afcd4861613e4626c9fe"],["GL.ts","80264aa9cc9244bad3b67bde48758970"],["GameEngine.js","595cff7e4e1e0696b25a07069b2ba442"],["GameEngine.js.map","d5369d285cfbea4adf5f9c4686d5a208"],["GameEngine.ts","0227ab03f234d7fe2d76570990124ed9"],["GameRenderer.js","e2d5aec36293dacab09edbb45128f7aa"],["GameRenderer.js.map","e4c1a052615c645dab2a85b39433abd0"],["InfiniteMap.js","9af96e2cc8004591e6bcdb9c3469d1a3"],["InfiniteMap.js.map","9216d65e874f04b08a080a6920981d9d"],["Machine.js","b7374f03226d70058789b25f440d5e7f"],["Machine.js.map","5fe5df5e8b2f12a1272aa8004e2f705f"],["Machine.ts","7055a81c3eedd885145881379c7a81d7"],["ST.js","72478294818d0530c622405ac1e6247b"],["ST.js.map","a04d4192694c78a19e7f84faa0f217ba"],["ST.ts","929be98d3797f6f9f376a1c1d464a655"],["Scene.js","bc3bcc1c2e9bc4ff290bce6e0ffba87c"],["Scene.js.map","da341e02fa4c20ba5f219ceaa33402e4"],["Scene.ts","1fb792e71fd2be0e3ffd4a44f5ae580b"],["SpriteLoader.js","4e185ec541746bee3f9e729b6913e941"],["SpriteLoader.js.map","bdd3d1136e3d7a5794ef18ec9055a5b5"],["SpriteLoader.ts","d6f389b8b96de34628df1fddc9e2ce56"],["UI.js","55b68748848d8fb57e32aa82c703a087"],["UI.js.map","6ea48cf517f871d5b98394a9efe73b58"],["UI.ts","93c08b8ca3b787b2fb2a098392f96192"],["assets/cursors/cursor.png","e127099845993f7026dad9ea067a5e40"],["assets/cursors/hand.png","e213fef3b101fd364096e8ff8024ff7d"],["assets/cursors/ibar.png","970e5df973492b91bbec7829c79073b3"],["assets/maps/arena.png","299acabf60da555a79919fe9eab4b780"],["assets/maps/blankmap.png","10cc268bde9c1836032c9cdc40386c38"],["assets/maps/caldera.png","af6344603f5bf0ad2b9b3e1201bbf831"],["assets/maps/canyon.png","34d94df68c207706c6acbdee22472d81"],["assets/maps/caves.png","2010ea528d4b2ffc590efe891b53f546"],["assets/maps/delta.png","75a5ae0e4b0f4c3b6c4cd291883f5b8b"],["assets/maps/desert.png","83e96c8f263877f21b7c1c38220fc5a6"],["assets/maps/fortress.png","66b1939aec1c96737cbb581da5f46081"],["assets/maps/grassland.png","1f6c8e6a611f5251c3c5a7562134ca1b"],["assets/maps/island.png","9064f62f3c7ec16b94d223591821d525"],["assets/maps/maps.json","c3732ce89f0fefd7857b2b2249200165"],["assets/maps/maze.png","0e5371dd52a5d5ed479b9c189c28894b"],["assets/maps/mini.png","a24dcd2ec06fc92009a57c41c3840808"],["assets/maps/oilrush.png","dfca51580cbe8c8c652a8ad8b18cdd4c"],["assets/maps/pit.png","08a740423f10807d7fd0fa0f224bf422"],["assets/maps/scorch.png","01817fdebcedd9403d12923c9b5870ae"],["assets/maps/sinkhole.png","c1acea188974d10109407aa2494912df"],["assets/maps/spiral.png","35b86f120c01c17e37b9dc81d9c7d096"],["assets/maps/test.png","d46713a23933fb56a251c736b1513cfd"],["assets/maps/test1.png","d6b0b695028116327052a165e15df85b"],["assets/maps/test2.png","b99f382118d87b4edf3fcf4f4577efc9"],["assets/maps/test3.png","0b80788303ed1a1b32c76f527b6e7f89"],["assets/maps/tundra.png","c1d53f6a8f7d90858364a32fa9a90261"],["assets/maps/tutorial.png","d26302963f27fc2b909dde6c8a6694b8"],["assets/maps/volcano.png","376a0afd8928d3b84cde9fd85651f7af"],["assets/sprites/background.png","4495775fd0ecf1b7c63e33fdc4586649"],["assets/sprites/icon.png","2fd76567d8e9f403e81f82ffd272d225"],["assets/sprites/sprites.json","05bcb5a2166eacc7796dec13a7550c3b"],["assets/sprites/sprites.png","cee099921dcb1392ac7855329ecbff0e"],["assets/ui/korean.png","e61bf86a5317c2f12df20842e1594813"],["assets/ui/square.fnt.json","5b5a1ac1a366192f4c6b04daba321749"],["assets/ui/square.png","ac3443cb73576e64641d620ebce039a4"],["assets/ui/title.fnt.json","4a7dac9009d45628b5316522447f63fa"],["assets/ui/title.png","3c42915cc834034566113814098b0a5c"],["assets/ui/uiskin.json","ce02d37ac3cb4c2e1ca315a731dd6cfc"],["config.js","167ca128f00b076819db22724ddfdc33"],["global.js","b66277c01c4f16e65c71ce1744c7daec"],["global.js.map","cc1435d3665ef3f621a918ae81a1e5a2"],["global.ts","8ab44ececc6b3a1def8f6fdb37a968aa"],["icons/144.png","2983516234e59752dbbebe3b72b15d43"],["icons/192.png","5fa60811c7f7f9c68f6a435888fe4eee"],["icons/32.png","2fd76567d8e9f403e81f82ffd272d225"],["icons/48.png","9a165c7b82564c4402f840234ec7ebfc"],["icons/512.png","1b51c72064511dc7e8cb56fcc6f83554"],["icons/72.png","2b6f607ff737b50e0e36bb5481cfcff6"],["icons/96.png","aa12bea162d6fe429604a78b69960843"],["index.html","f9e74d5623cfac3792471874404afcae"],["index.js","251626921629c7ea3392ae0b511976de"],["index.js.map","e0cb6182a6a807cb6a3cd2651d443b4f"],["index.tsx","0c8072ab1a68e52b36111d7dfdc817ba"],["jspm_packages/github/systemjs/plugin-image@0.1.0.js","ae27704049e36a1edfc5473f29f113b1"],["jspm_packages/github/systemjs/plugin-image@0.1.0/image.js","06fabaa63d11523a4d3ab916f471cd1f"],["jspm_packages/github/systemjs/plugin-json@0.3.0.js","1030ebeb651944fee2f4095267920e36"],["jspm_packages/github/systemjs/plugin-json@0.3.0/json.js","b07e6db8f84e08611403ba001deb9fd9"],["jspm_packages/github/systemjs/plugin-text@0.0.11.js","65ddfd6e4e7c39d9ec6c6baf98587dc7"],["jspm_packages/github/systemjs/plugin-text@0.0.11/text.js","b36b238bb1568fa0aa85c4a7e4ccdd2b"],["jspm_packages/npm/immutable@3.8.2.js","8f79c100b3c47749ad3f18a65f246ecc"],["jspm_packages/npm/immutable@3.8.2/contrib/cursor.js","baa454ee6ec17052a893e358e12b46db"],["jspm_packages/npm/immutable@3.8.2/contrib/cursor/index.js","763a077ccc910a42535fee308dfb6fb5"],["jspm_packages/npm/immutable@3.8.2/dist/immutable.js","297b39c5875478c0ef40f39b5b6c13ac"],["jspm_packages/npm/immutable@3.8.2/dist/immutable.min.js","0c823b4ed8693d4db07c1bd639f122bd"],["jspm_packages/system-csp-production.js","dfc65af39c10ff59477d56cfb2350105"],["jspm_packages/system-csp-production.js.map","fb005b7de915ae5f858370187bb95f29"],["jspm_packages/system-csp-production.src.js","f85de85f0c3af5890ba7ae7770d6e786"],["jspm_packages/system-polyfills.js","e772bf28c558e70dd804b3da43237050"],["jspm_packages/system-polyfills.js.map","4e5ef6e5114448b50cdd4a27aafaeb11"],["jspm_packages/system-polyfills.src.js","ae635fcfb98782688ad8a2de25127e79"],["jspm_packages/system.js","eccc019329febb5a1b06bde008ca5614"],["jspm_packages/system.js.map","aaf93fa27e9dc83d0149b33f589c0d6b"],["jspm_packages/system.src.js","d3d8b4607024dae61eed0e09dcd10461"],["loading.css","98fe539cbbf707e48f5fb2a83e49fd03"],["manifest.webmanifest","f54a249299fbd543add7984c434cdbee"],["prepare.js","9ccd48f0d4a21d3a607651f9e6a18b1b"],["prepare.js.map","4b96d75e6485abef18fe870def8ef0c7"],["prepare.ts","4ae7e610de058a46692ed461d233bb7e"],["shaders/default.frag","40de323909baf0f3af5506ff952ae7f5"],["shaders/default.vert","07fcfc712c6e58f896a1c30814f1c060"],["style.css","a3e02df0bed97dc4805fb7409d8c0ae1"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







