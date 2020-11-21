export function getLocation(){

    if (navigator.geolocation){

        return new Promise ((res,rej) => {
            navigator.geolocation.getCurrentPosition(res, rej, {timeout:10000})
            console.log("getlocation test3");
        })
 
    }
    else{
        return "Error: browser does not support geolocation";
    }
   
}