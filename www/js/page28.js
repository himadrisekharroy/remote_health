$("#back_to_doctor_page27").click(function(){
	slideBabyRight("doctor_page27.html");
})

var urlParams = new URLSearchParams(window.location.search)
var user_id = urlParams.get('user_id');

$("#doctor_images_show").html('<img src="'+site_url+'images/doctor_images/'+storage.getItem("logged_user_image")+'" width="50">');
$.post( api_url+"get_user_details.php", {func: "get_user_details_by_id", user_id: user_id})
	.done(function(data){
		console.log(data);
	 	data = JSON.parse(data);
	 	if(data.success)
	 	{
	 		$("#user_img").attr("src", site_url+"images/user_images/"+data.data.image);
	 		$("#user_name").html(data.data.f_name+" "+data.data.l_name);
	 		$("#mobile").html(data.data.mobile);
	 		$("#email").html(data.data.email_id);
	 		$("#sex").html(data.data.gender);
	 		$("#age").html(data.data.age+" Yr");

	 		$("#usersec").show();
	 		$("#loading_screen").slideUp();
	 	}
	 	else
	 	{

	 	}
 	}) 

readChat('1st_time');

setInterval(function(){ 
	 readChat('not_1st_time');
}, 6000);

function readChat(call_time)
{
	$.post( api_url+"get_text_chat_details.php", {
				func: "get_message", 
				user_id: user_id,
				doc_id:storage.getItem("logged_user_id"),
				logged_user_type: storage.getItem("logged_user_type"),
				call_time: call_time
			})
	.done(function(dataInner){
		console.log(dataInner);
		dataInner = JSON.parse(dataInner);

		var chat_message = "";
		for(var key in dataInner.chat)
 		{
 			var d = new Date((dataInner.chat[key].time)*1000);
 			var timeStr = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes();
 				
 			if(dataInner.chat[key].type == 'd')
 			{ 				
 				chat_message += '<div class="message darker">';
		  		chat_message += '<img src="'+site_url+"images/doctor_image/"+dataInner.dimage+'" alt="Avatar" class="right" style="width:100%;">';
		  		chat_message += '<p>'+dataInner.chat[key].msg+'</p>';
		  		chat_message += '<span class="time-left">'+timeStr+'</span>';
				chat_message += '</div>'
 			}
 			else
 			{
 				chat_message += '<div class="message">';
				chat_message += '	<img src="'+site_url+"images/user_images/"+dataInner.uimage+'" alt="Avatar" style="width:100%;">';
				chat_message += '  	<p>'+dataInner.chat[key].msg+'</p>';
				chat_message += '  	<span class="time-right">'+timeStr+'</span>';
				chat_message += '</div>';
 			}
 		}
		$("#chat_message").html(chat_message);
		$('.chat_message').height(parseInt($(document).height())-350);

			// var height = 0;
			// $('.message').each(function(i, value){
			//     height += parseInt($(this).height());
			// });

			// height += '';
			//if(call_time !='not_1st_time')
				$('.chat_message').scrollTop(9999999);
	})
}

 $("#submit_chat").click(function(){
   		$('#chat_message_input').focus();
   		sendChat();
   })

   	$('#chat_message_input').keydown(function(event) {    
   		if (event.keyCode == 13) {
      		sendChat();
      		return false;
   		}
   	 });
function sendChat()
{
	$.post( api_url+"get_text_chat_details.php", 
	{
		func: "save_message", 
		user_id: user_id,
		doc_id:storage.getItem("logged_user_id"),
		msg: $("#chat_message_input").val(),
		type:"d"
	})
	.done(function(data){
		console.log(data);
 		
		$("#chat_message_input").val("");
		$("#chat_message_input").blur();

 		dataInner = JSON.parse(data);

 		var chat_message = "";
		for(var key in dataInner.chat)
 		{
 			var d = new Date((dataInner.chat[key].time)*1000);
 			var timeStr = d.getDate() + '/' + (d.getMonth()+1) + '/' + d.getFullYear() +" "+d.getHours()+":"+d.getMinutes();
 				
 			if(dataInner.chat[key].type == 'd')
 			{
 				
 				chat_message += '<div class="message darker">';
		  		chat_message += '<img src="'+site_url+"images/doctor_image/"+dataInner.dimage+'" alt="Avatar" class="right" style="width:100%;">';
		  		chat_message += '<p>'+dataInner.chat[key].msg+'</p>';
		  		chat_message += '<span class="time-left">'+timeStr+'</span>';
				chat_message += '</div>'
 			}
 			else
 			{
 				chat_message += '<div class="message">';
				chat_message += '	<img src="'+site_url+"images/user_images/"+dataInner.uimage+'" alt="Avatar" style="width:100%;">';
				chat_message += '  	<p>'+dataInner.chat[key].msg+'</p>';
				chat_message += '  	<span class="time-right">'+timeStr+'</span>';
				chat_message += '</div>';
 			}
 		}
		$("#chat_message").html(chat_message);
		$('.chat_message').height(parseInt($(document).height())-350);

			// var height = 0;
			// $('.message').each(function(i, value){
			//     height += parseInt($(this).height());
			// });

			// height += '';
			$('.chat_message').scrollTop(9999999);
 	})
}