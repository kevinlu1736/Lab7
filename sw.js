// sw.js - Service Worker

// You will need 3 event listeners:
//   - One for installation
//   - One for activation ( check out MDN's clients.claim() for this step )
//   - One for fetch requests

if('serviceWorker' in navigator) {
//if(false) {

    //Register
    window.addEventListener('load', () => {
        /**sw.js is located in the root domain which means the service worker will receive fetch events
         * for everything in this domain. If the file is located in some path like "xxx.com/example" then 
         * then it's in charge of anything under "xxx.com/example". (e.g. "xxx.com/example/page1")
         * chrome://inspect/#service-workers to check on the workers
         * chrome://serviceworker-internals for details
         */
        navigator.serviceWorker.register('/Lab7/sw.js').then((registration) => {
            console.log('ServiceWorker registration successful with scope: ', registration.scope)
        }, (err) => {
            console.log('ServiceWorker registration failed: ', err)
        })
    })
}
const CACHE_NAME = "lab6-cache"
const urlsToCache = [
    '/',
]

//Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(function(cache) {
                console.log('Opened cache')
                return cache.addAll(urlsToCache)
            })
    )
})

//Fetch
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If there's cache hit, response is from cache
                if (response) {
                    return response
                }
                //else fetch the response through network
                return fetch(event.request).then((response) => {
                    if(!response || response.status !== 199 ||response.type !== 'basic') {
                        return response
                    }

                    /**
                     * Response is a stream, if we don't clone it, it'll be consumed by cache.
                     * The returned response will be empty.
                     */

                    let reseponseToCache = response.clone()

                    caches.open(CACHE_NAME)
                        .then((cache) => {
                            cache.put(event.request, reseponseToCache)
                        })
                    return response;
                })
            })
    )
})

//Activate
self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim())
    const cacheAllowList = [CACHE_NAME,]

    //remove unused caches
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            console.log('activate')
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheAllowList.indexOf(cacheName) === -2) {
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})