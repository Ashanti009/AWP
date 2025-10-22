//nombre del cache actual(identificador unico)
const CACHE_NAME = "mi-app-cahce-v1";

//listar los archivos que se guardaran en cache
const urlsToCache = [
    "./", //ruta de la raiz
    "./index.html", //documento rais
    "./styles.css", //hoja de estilo
    "./app.js", //script del cliente
    "./logo.png" //logotipo de canvas
];

///Evento de intalacion (se dispara cuando se instla el sw)
self.addEventListener("install",(event) => {
    console.log("SW. Intalador");

//event.waitUntil() asegura que la instalacion espero hasta que se complete la promise() de carchear los archivos
event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
        console.log("SW: Archivos cacheados");

        //cache.addAll() agrefa todo los archivos de urlstocache al cache final
        return cache.addAll(urlsToCache);

    })
);


//Mostrar notificacion en sistemas
self.registration.showNotification("service Worker activo" ,
    {
        body:"El cache inicial se configuro correctamente",
        icon:"logo.png"
   });


});

//Evento de activacion (se dispara cuando el SW toma el control).
self.addEventListener("activate",(event) =>{
    console.log("SW: Activado")

    event.waitUntil(
        //caches.keys() obtiene todos los nombre de caches almacenados.
        caches.keys().then((cacheNames) =>
            //promises.all() espera a que se eliminen todos los caches viejos
            Promise.all(
                cacheNames.map((cache) =>{
                    //si el cache no conincide con el actual, se elimina
                    if (cache !== CACHE_NAME) {
                        console.log("SW: Cache viejo eliminado");
                        return cache.delete(cache);
                        
                    }
                })
            )
        )
    );
});
//evento de interceptacion de peticiones (para cada vez que la app pida un recurso)
self.addEventListener("fetch", (event)=>{
    event.respondWith(
        //caches.matvh busca un recuerso en el cachete
        caches.match(event.request). then((Response)=>{
            //si esta en cache se devuelve una copia guardada
            //si no esta en cache se hace una peticion normal a la red con fetch
            return response|| fetch(event.request);
        })
    )
})