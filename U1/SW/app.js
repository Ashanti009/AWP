//verificar si el navegador  web soporta service worker
if("serviceWorker" in navigator){
    //llamar el metodo register para registrar un SW
    //El parametro /sw.js es la ruta del archibo de SW
    navigator.serviceWorker
    .register("./sw.js")

    //the se ejecuta si el registro fue exitoso
    //reg es un objeto tipo serviceworker registration con informacion del SW
    .then((reg)=>console.log("service workes registrado: ", reg))
     //catch si ocurre un error en el reistro
     //err contiene el mensaje o detalle del error
     .catch((error)=>console.log("Error al registrar el SW: ", err));
     }

     //agregamos un evento clic al boton check
     document.getElementById("check").addEventListener("click", ()=>{
        //verificar si el SW controla la pagina actual
        if(navigator.serviceWorker.controller){
            alert("El service worker esta activo y controlando la pagina.");
            
        }else{
            alert("El service worker aun no esta activo.")
        }
     });

//area de notificacion
if(Notification.permission==="default"){
    Notification.requestPermission().then((perm)=>{
        if(perm==="granted"){
            console.log("permiso de Notificacion consedido")
        }
    });
};