jQuery(document).ready(function($) {
    var urlParams = new URLSearchParams(window.location.search);
	var doc_id = urlParams.get('id');
    var appt_id = urlParams.get('appt_id');

    $("#app_user_id").val(window.localStorage.getItem("logged_user_id"));

    if(appt_id)
    {
        $("#reschedule_bottom_link").show();
        $("#booked_bottom_link").hide();
    }
    var today = new Date();
    getAppointmentTiming(today.getDay(), today.getDate(), today.getMonth(), today.getFullYear())
    
    $("#app_year").val(today.getFullYear());
    $("#app_month").val(today.getMonth());
    $("#app_day").val(today.getDay());
    $("#app_date").val(today.getDate());

    $("#app_doc_id").val(doc_id);
    Calendar.setup(
    {          
        parentElement: 'embeddedCalendar',
        selectHandler: function(response){
            var today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
            console.log(response.date);
            var d= new Date(response.date);
            
            if(d.getTime() >= today.getTime())
            {
                var timeSlotsHtml   =   '<div class="alert alert-warning" >';
                timeSlotsHtml   +=  '   <strong>Wait!</strong> Processing time.....';
                timeSlotsHtml   +=  '</div>';
                console.log(d.getDay());
                $("#time_slots").html(timeSlotsHtml);
                
                 $("#app_year").val(d.getFullYear());
                 $("#app_month").val(d.getMonth());
                 $("#app_day").val(d.getDay());
                 $("#app_date").val(d.getDate());
                
                
                $.post( api_url+"get_video_chat_details.php", {
                    func: "get_nurse_schedule", 
                })
                .done(function(data){
                    console.log(data);
                    data = JSON.parse(data);            
                    if(data.success)
                    {
                        var sch = data.nstruc;
                        console.log(sch.length);
                        var scheduleHtml= "";
                        for(var i=0; i < sch.length; i++)
                        {
                            if(i == 0) var classname="nurse_schedule schedule_seleced";
                            else var classname="nurse_schedule ";

                            scheduleHtml += "<a href='javascript:void(0)' id='nurseschedule_"+sch[i]['book_min']+"_"+sch[i]['fees']+"' class='"+classname+"'>" + sch[i]['book_min'] +" Min.<br/>Rs. "+sch[i]['fees']+"/- </a>" ;
                        }
                        $("#slot_container").html(scheduleHtml);
                    }
                    else
                    {
                        $("#slot_container").html(data.msg);
                    }
                })

                $.get( api_url+"get_doctor_details.php", {func: "nurse_provided_service"})
                .done(function(data){
                    console.log(data);
                    data = JSON.parse(data);

                    var html_str = '<ul class="list-group">';
                    var services = data.data;
                    for(var key =0 ; key < services.length; key++)
                    {
                        html_str += '<li class="list-group-item ns" id="ns'+data.data[key].id +'">';
                        html_str +=     '<span class="specialization">';
                        html_str +=         '<img src="http://remotehealth.org/images/nurse_service.png"  class="img-reponsive img-rounded" />';
                        html_str +=     '</span> &nbsp;';
                        html_str +=     data.data[key].title;
                        html_str +=     '<ul class="list-group inner collapse" id="sub'+ data.data[key].id +'">';
                        html_str +=     '<li class="list-group-item"> Please Wait </li>';
                        html_str +=     '</ul>'
                        html_str += '</li>';
                    }
                    html_str +="</ul>";
                   $("#time_slots").html(html_str).find(".ns").on('click', function () {
                        var id = $(this).attr("id");
                        id = id.replace("ns", "");
                        $("#sub"+id).slideDown();
                        loadNurse("sub"+id);             
                    });;
                    //alert( "Data Loaded: " + data );
                });
            }
            else
            {
                var timeSlotsHtml   =   '<div class="alert alert-danger" >';
                timeSlotsHtml   +=  '   <strong>Not available!</strong> Please choose future date.....';
                timeSlotsHtml   +=  '</div>';
                $("#time_slots").html(timeSlotsHtml);
            }
        }
    })
    
    function getAppointmentTiming(day_id, date, month, year) // same function code written in calender selectHandler function
    {
        var timeSlotsHtml   =   '<div class="alert alert-warning" >';
        timeSlotsHtml   +=  '   <strong>Wait!</strong> Processing time.....';
        timeSlotsHtml   +=  '</div>';
        $("#time_slots").html(timeSlotsHtml);
        
        $.post( api_url+"get_video_chat_details.php", {
             func: "get_nurse_schedule", 
        })
        .done(function(data){
            console.log(data);
            data = JSON.parse(data);            
            if(data.success)
            {
                var sch = data.nstruc;
                console.log(sch.length);
                var scheduleHtml= "";
                for(var i=0; i < sch.length; i++)
                {
                    if(i == 0) var classname="nurse_schedule schedule_seleced";
                    else var classname="nurse_schedule ";

                    scheduleHtml += "<a href='javascript:void(0)' id='nurseschedule_"+sch[i]['book_min']+"_"+ sch[i]['fees'] +"' class='"+classname+"'>" + sch[i]['book_min'] +" Min.<br/>Rs. "+sch[i]['fees']+"/- </a>" ;
                }
                $("#slot_container").html(scheduleHtml);
            }
            else
            {
                $("#slot_container").html(data.msg);
            }
        })

        $.get( api_url+"get_doctor_details.php", {func: "nurse_provided_service"})
        .done(function(data){
            console.log(data);
            data = JSON.parse(data);

            var html_str = '<ul class="list-group">';
            var services = data.data;
            for(var key =0 ; key < services.length; key++)
            {
                html_str += '<li class="list-group-item ns" id="ns'+data.data[key].id +'">';
                html_str +=     '<span class="specialization">';
                html_str +=         '<img src="http://remotehealth.org/images/nurse_service.png"  class="img-reponsive img-rounded" />';
                html_str +=     '</span> &nbsp;';
                html_str +=     data.data[key].title;
                html_str +=     '<ul class="list-group inner collapse" id="sub'+ data.data[key].id +'">';
                html_str +=     '<li class="list-group-item"> Please Wait </li>';
                html_str +=     '</ul>'
                html_str += '</li>';
            }
            html_str +="</ul>";
            $("#time_slots").html(html_str).find(".ns").on('click', function () {
                var id = $(this).attr("id");
                id = id.replace("ns", "");
                $("#sub"+id).slideDown();
                loadNurse("sub"+id);            
            });;
            //alert( "Data Loaded: " + data );
        });
       
    }
    
    
    
    // $("#appointment_book_next").click(function(){
    //     if(!$("#app_time").val())
    //     {
    //         alert("Please select a slot.");
    //     }
    //     else
    //     {
    //         var r = confirm("Sure To procceed...");
    //         if(r == true)
    //         {
    //             $("#app_book_form").submit(); 
    //         }
            
    //     }
    // })
    $("#appointment_book_reschedule").click(function(){
        if(!$("#app_time").val())
        {
            alert("Please select a slot.");
        }
        else
        {
            var time = $("#app_time").val();
            time = time.split(":");

            var c = new Date().getTime();
            var t = new Date();
            t.setDate(parseInt($("#app_date").val()));
            t.setMonth(parseInt($("#app_month").val()));
            t.setFullYear(parseInt($("#app_year").val()));
            t.setHours(parseInt(time[0]));
            t.setMinutes(parseInt(time[1]));
            t.setSeconds(0);
            t = t.getTime();
            if(c > t)
                alert("Please select any future time time slot!!!");
            else
            {
                var r = confirm("Sure To procceed...");
                if(r == true)
                {
                    console.log($("#app_date").val());
                    console.log($("#app_month").val());
                    console.log($("#app_year").val());

                    $("#mask_layer").show();
                    $.post( api_url+"get_video_chat_details.php", {
                    func: "reschedule_appt", 
                    appt_id: appt_id ,
                    app_date:   $("#app_date").val(),
                    app_month:  $("#app_month").val(),
                    app_year:   $("#app_year").val(),
                    app_time: $("#app_time").val()
                    })
                    .done(function(data){
                       // console.log(data);
                        data = JSON.parse(data);
                        if(data.success)
                        {
                            alert("Appointment rescheduling is successful. Please wait...");
                            window.location.href="video_chat_book_reschedule36.html?appt_id="+appt_id;
                        }
                        else
                        {
                            alert("Appontment rescheduling is unsuccessful. Please Try again later ");
                            $("#mask_layer").hide();
                        }
                    })
                }
            }
        }
    })

    $(document).on('click', '.nurse_schedule', function(){
   // $(".nurse_schedule").on('click',function(){
        var id = $(this).attr("id");
        id = id.replace("nurseschedule_", "");

        $(".nurse_schedule").removeClass("schedule_seleced");
        $("#nurseschedule_"+id).addClass("schedule_seleced");
        //alert(data);
        id = id.split("_");
        $("#app_nurse_schedule").val(id[0]);
        $("#app_nurse_fees").val(id[1]);        
    })

    $(document).on('click', '.lb_book_btn', function(){
        var b_time = $("#appt").val();
        if(!b_time){
            alert("Please select time");
        }
        else
        {
            $("#app_time").val(b_time);

             if(!$("#app_time").val())
            {
                alert("Please select a slot.");
            }
            else
            {
                var today = new Date();
                var current = new Date();
                b_time = b_time.split(":");
                current.setHours(b_time[0]);
                current.setMinutes(b_time[1]);
                if(current.getTime() >= today.getTime())
                {
                    var r = confirm("Sure To procceed...");
                    if(r == true)
                    {
                        $("#app_book_form").submit(); 
                    }
                }
                else
                {
                    alert("Select Proper time");
                }
            }
        }
        
    })

    $(document).on('click', '.lb_close_btn', function(){
        $('#mask').hide();
        $('.boxes').hide();
    })
    function loadNurse(id)
    {
        $(".collapse").hide();
        $("#"+id).slideDown();

        id = id.replace("sub", "");

        $.post( api_url+"get_doctor_details.php", {
            func: "get_service_nurse_day_avail", 
            service_id: id,
            day_id:$("#app_day").val()
            })
            .done(function(data){
                console.log(data);
            data = JSON.parse(data);

            var html_str = '';
            if(!data.success)
            {
                html_str +=     '<li class="list-group-item"> '+data.msg+' </li>';
            }
            else
            {
                var nurse_list = data.data;

                for(var key=0; key < nurse_list.length; key++)
                {
                    var reviewCount =0;
                    
                    var reviewArray = data.data[key]['review'];
                    if(Array.isArray(reviewArray)) reviewCount = reviewArray.length;

                    html_str += '<li class="list-group-item" id="list-group-item_">';                                   
                    html_str +=                 '<div class="row doctor-details">';                         
                    html_str +=                     '<div class="col-2 doctors">';
                    html_str +=                         '<img src="'+site_url+'images/doctor_image/'+data.data[key].image+'"  class="img-reponsive img-rounded" />';
                    html_str +=                     '</div>';
                    html_str +=                     '<div class="col-8">';
                    html_str +=                         '<b style="text-transform:uppercase">'+data.data[key].f_name+' '+data.data[key].l_name+'</b><br/>';
                    html_str +=                         '<small>'+data.data[key].designation+'</small><br/>';
                    html_str +=                         '<a href="view-review23.html?id='+data.data[key].id+'"><small>'+reviewCount+' Reviews</small></a><br/>';                
                    html_str +=                         '<small>Language Known: '+data.data[key].language_known+'</small><br/>';
                    html_str +=                     '</div>';
                    html_str +=                     '<div class="col-2">';
                    
                    html_str +=                    '</div>';
                    html_str +=                 '</div>';
                    html_str +=                 '<div class="row doctors-link7">';
                    html_str +=                     '<div class="col-4">';
                    html_str +=                         '<a href="doctor-profile10.html?id='+data.data[key].id+'"><i class="fa fa-id-card" aria-hidden="true"></i><br/><small>PROFILE</small></a> </div>';
                    html_str +=                         '<div class="col-4"><a href="javascript:void(0)" id="trans_to_chat" onclick="check_msg_subscription('+data.data[key].id+');"><i class="fa fa-comments-o" aria-hidden="true"></i><br/><small>CHAT</small></a> </div>';
                    html_str +=                         '<div class="col-4"><a href="javascript:void(0);" class="nurse_book_btn" id="book_'+data.data[key].id+'"><i class="fa fa-calendar" aria-hidden="true"></i><br/><small>BOOK</small></a></div>';
                    html_str +=                     '</div>';
                    html_str += '               </div>';
                    html_str += '</li>';
                }
            }
            $("#sub"+id).html(html_str);
         })
    }

     $(document).on('click', '.nurse_book_btn', function(){
   // $(".nurse_schedule").on('click',function(){
        var id = $(this).attr("id");
        id = id.replace("book_", "");
        $("#app_doc_id").val(id);

                
        //transition effect     
        $('#mask').fadeIn(1000);    
        $('#mask').fadeTo("slow",0.8);  
    
        //Get the window height and width
        var winH = $(window).height();
        var winW = $(window).width();
              
        //Set the popup window to center
        // $("#dialog_dddd").css('top', 0);
         $("#dialog_dddd").css('top',  winH/2-$("#dialog_dddd").height()/2);
        //$(id).css('top',  (winH/2-$(id).height()/2)+window.pageYOffset);
        $("#dialog_dddd").css('left', winW/2-$("#dialog_dddd").width()/2);
        //alert(window.pageYOffset);
        //transition effect
        $("#dialog_dddd").fadeIn(2000);
    })


    //if mask is clicked
    $('#mask').click(function () {
        $(this).hide();
        $('.boxes').hide();
    });         
    


})
