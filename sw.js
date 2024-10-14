//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE_NAME = 'static-v2';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';
const INMUTABLE_CACHE_NAME = 'inmutable-v1';

//cosas que son parte de la web y hemos creado nosotros
const APP_SHELL = [
    '/',
    'index.html',
    'css/style.css',
    'img/favicon.ico',
    'img/avatars/spiderman.jpg',
    'img/avatars/hulk.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/wolverine.jpg',
    'js/app.js',
    'js/sw-utils.js'
];

//librerias externas que no se va a modificar jamas
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css',
    'css/animate.css',
    'js/libs/jquery.js'

];

self.addEventListener('install', e => {
    const staticCache = caches.open(STATIC_CACHE_NAME)
    .then(cache => cache.addAll(APP_SHELL))

    const inmutableCache = caches.open(INMUTABLE_CACHE_NAME)
    .then(cache => cache.addAll(APP_SHELL_INMUTABLE))

    e.waitUntil(Promise.all([staticCache, inmutableCache]));
});

self.addEventListener('activate', e => {
    const respuesta = caches.keys().then( keys => {
        keys.forEach(key => {
            if(key !== STATIC_CACHE_NAME && key.includes("static")){
                return caches.delete(key);
            }
        });
    });

    e.waitUntil(respuesta);
});

self.addEventListener('fetch', e => {
    const cachePromise = caches.match(e.request).then(resp => {
        if(resp){
            return resp;
        }else{
            return fetch(e.request).then(newResp => {
                return actualizaCacheDinamico(DYNAMIC_CACHE_NAME, e.request, newResp);
            });
        }
    });
    e.respondWith(cachePromise);
});