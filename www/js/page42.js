var urlParams = new URLSearchParams(window.location.search)
var app_id = urlParams.get('app_id');

$.post( api_url+"get_doctor_details.php", { func:"specialization_list"})
     .done(function(data){
        //alert(data);
        data = JSON.parse(data);
        for(var key in data.data)
        {
           $("#specialization_id").append(new Option(data.data[key]['title'], data.data[key]['id']));
        }
        $("#doctor_signup_btn").prop('disabled', false);
    })

	$.post( api_url+"get_doctor_details.php", { func:"language_known"})
     .done(function(data){
        //alert(data);
        data = JSON.parse(data);
        var lang_html_str="";
        for(var key in data.data)
        {
        	lang_html_str +='<div class="form-check-inline">';
			lang_html_str +='<label class="form-check-label">';
			lang_html_str +='<input type="checkbox" class="form-check-input" name="lang[]" value="'+data.data[key]['id']+'">'+ data.data[key]['title'];
			lang_html_str +='</label>';
			lang_html_str +='</div>';

           $("#lang_html").html(lang_html_str);
        }
        $("#doctor_signup_btn").prop('disabled', false);
    })

    $.post( api_url+"get_doctor_details.php", { func:"nurse_provided_service"})
     .done(function(data){
        //alert(data);
       data = JSON.parse(data);
        for(var key in data.data)
        {
           $("#service_id").append(new Option(data.data[key]['title'], data.data[key]['id']));
        }
        $("#doctor_signup_btn").prop('disabled', false);
    })



$("#add_jr_doc").click(function(){
	$("#btn_container").hide();
	$("#form_container").slideDown();
	$("#nurse").hide();
	$("#services").hide();
	$("#func").val("jr_doc_registration");
	$("#service_id").prop('required',false); 
	$("#nurse_type").prop('required',false); 
	$("#page_title_text").html("Add Jr. Physician");
	$("#refered_by").val(storage.getItem('logged_user_id'));
});

$("#add_nurse").click(function(){
	$("#btn_container").hide();
	$("#form_container").slideDown();
	$("#nurse").show();
	$("#services").show();
	$("#func").val("nurse_registration");
	$("#service_id").prop('required',true); 
	$("#nurse_type").prop('required',true); 
	$("#page_title_text").html("Add Nurse");
	$("#refered_by").val(storage.getItem('logged_user_id'));
});

$("#doctor_signup_form").submit(function(e){
	e.preventDefault();
	$("#doctor_signup_btn").prop('disabled', true);
	$(".alert-warning").show();
	$(".alert-success").slideUp();
	$(".alert-danger").slideUp();


	if($('#lang_html :checkbox:checked').length > 0)
	{
		var formdata = new FormData($('#doctor_signup_form')[0]);

		$.ajax({
         url         : api_url+"get_doctor_details.php",
         data        : formdata,// ? formdata : $("#form_sample_1").serialize(),
         cache       : false,
         contentType : false,
         processData : false,
         enctype: 'multipart/form-data',
         type        : 'POST',
         success     : function(data, textStatus, jqXHR){
           console.log(data)
            data = JSON.parse(data);
           	if(data.success)
		    {
		    	$("#doctor_signup_form input").val("");
		    	$("#doctor_signup_form select").val("");
		    	$("#doctor_signup_form textarea").val("");
		    	$('input:radio').prop('checked', false);
		    	$('input:checkbox').prop('checked', false);

		    	$(".bottom").hide();		    	
		    	
		    	$(".alert-success").html("<strong>Success:</strong>"+ data.msg).slideDown();
		    	setTimeout(function(){
				    $(".alert-danger").slideUp();
				    $(".alert-success").slideUp();
				    $("#doctor_signup_btn").prop('disabled', false);
				}, 3000);
		    }
		    else
		    {
		    	$(".alert-danger").html("<strong>Error:</strong>"+ data.msg).slideDown();
		    	$("#user_login_password").val("");	    	
		    	$("#doctor_signup_btn").prop('disabled', false);
		    	setTimeout(function(){
				   $(".alert-danger").slideUp();
				}, 3000);
		    }
		    $(".alert-warning").hide();
         }
      });
	}
	else
	{
		$(".alert").hide();
		$(".alert-danger").html("<strong>Error:</strong> Please select known languages.").slideDown();
		$("#doctor_signup_btn").prop('disabled', false);
	}
}) 