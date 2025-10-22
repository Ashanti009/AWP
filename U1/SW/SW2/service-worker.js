//nombre d ela cache
const cacheName= 'mi.cache-v2';

//archivos que se guardaran en cache
const cacheAssets=[
    'index.html',
    'pagina1.html',
    'pagina1.html',
    'offline.html',
    'styles.css',
    'main.js',
    'icono.png'
    
    
];
//instalacion del service worker
self.addEventListener('install', (Event)=>{
    console.log('SW: Instalado');
    Event.waitUntil(
        caches.open(cacheName).then((cache)=>{
            console.log('SW: cacheando archivos...');
            return cache.addAll(cacheAssets);
        })
        .then(()=> self.skipWaiting())
        .catch((err)=> console.log('Error al cachear archivos:', err))
    );
});

//activacion del service worker
self.addEventListener('activate', (event)=>{
    console.log('SW: activado');
    event.waitUntil(
        caches.keys().then((cacheNames)=> {
            return Promise.all(
                cacheNames.map((cache)=>{
                    if(cache !== cacheName){
                        console.log(`SW: Eliminando cache antiguo: ${cache}`);
                        return caches.delete(cache);

                    }
                })

            );
        })

    );
});

//Escucha mensajes desde la pagina
self.addEventListener('message', (event)=>{
    console.log('SW: recibio:', event.data);
    if(event.data === 'mostrar-notificacion'){
        self.registration.showNotification('Notificacion local.'
            ,{
                body: 'Esta es un aprueba de notificacion sin servidor push.',
                icon: 'icono.png'
            });
    }
});

//manejar peticiones de red con fallback offline
self.addEventListener('fetch', (event)=>{
    //ignorar peticiones innecesarias como extensiones o favicon
    if(
        event.request.url.includes('chrome-extension') ||
        event.request.url.includes('favicon.ico')
    ){
        return;
    }
    event.respondWidth(
        fetch(event.request)
        .then((response)=>{
            //si la respuesta e svalida la devuelve en el cache dinamico
            const clone = responde.clone();
            caches.open(cacheName).then((cache)=> cache.put(
            event.request, clone));
            return response;
        })
        .catch(()=>{
            //si no hay red buscar en cache
            return caches.match(event.request).then((response)=>{
                if(response){
                    console.log('Sw: recurso desde cache', event.request.url);
                    return response;
                }else{
                    console.warn('SW: mostrando pagina offline.');
                    return caches.match('offline.html');

                }
            });
        })
    );

})