export function setCookie(cname,cvalue) {
    window.document.cookie = cname + "=" + cvalue + ";";
  }
  
export function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(window.document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

  export function clearCookies() {
    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++){   
        var spcook =  cookies[i].split("=");
        document.cookie = spcook[0] + "=;expires=Thu, 21 Sep 1979 00:00:01 UTC;";                                
    }
  }