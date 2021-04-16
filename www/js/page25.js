 $( document ).ready(function() {
	var urlParams = new URLSearchParams(window.location.search);

	var doc_id = urlParams.get('id');
	

	$("#message_cart1").click(function(){		
//		window.location.href="temp_payment.html?sid=1&docid="+doc_id;
		$(".alert").hide();		
		$("#message_cart1").hide();
		$("#message_cart2").hide();
		$(".alert-warning").show();
		$.post( api_url+"get_text_chat_details.php", 
			{
				func: "temp_subscribe", 
				user_id: storage.getItem("logged_user_id"), 
				sid:1
			})
		.done(function(data){
			console.log(data);
				//alert(data);
			data = JSON.parse(data);
			if(data.success)
			{
				$(".alert").hide();	
				$(".alert-success").html("<strong>Please Wait..!!!</strong> Subscription is successfull.").show();
				setTimeout(function(){ 
					window.location.href="patient-chat24.html?id="+doc_id;
				}, 3000);
				
			}
			else
			{
				$(".alert").hide();	
				$(".alert-danger").html("<strong>Failed!</strong> Subscription is unsuccessfull.").show();
				//window.location.href="message-subscription25.html?id="+doc_id;
			}
		})
	})

	$("#message_cart2").click(function(){
		//window.location.href="temp_payment.html?sid=2&docid="+doc_id;

		$(".alert").hide();		
		$("#message_cart1").hide();
		$("#message_cart2").hide();
		$(".alert-warning").show();
		$.post( api_url+"get_text_chat_details.php", 
			{
				func: "temp_subscribe", 
				user_id: storage.getItem("logged_user_id"), 
				sid:2
			})
		.done(function(data){
			console.log(data);
				//alert(data);
			data = JSON.parse(data);
			if(data.success)
			{
				$(".alert").hide();	
				$(".alert-success").html("<strong>Please Wait..!!!</strong> Subscription is successfull.").show();
				setTimeout(function(){ 
					window.location.href="patient-chat24.html?id="+doc_id;
				}, 3000);
				
			}
			else
			{
				$(".alert").hide();	
				$(".alert-danger").html("<strong>Failed!</strong> Subscription is unsuccessfull.").show();
				//window.location.href="message-subscription25.html?id="+doc_id;
			}
		})
	})

	$("#back_to_user_page7").click(function(){
		slideBabyRight("user_page7.html");
	})
})