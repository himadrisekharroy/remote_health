var storage = window.localStorage;
var user_id = storage.getItem("logged_user_id"); 
if(!user_id)
   window.location.href="index1.html"; 
