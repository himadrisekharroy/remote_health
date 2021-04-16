/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        var session = "";
        
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        var api_url="https://remotehealth.org/telemed_api/";
        
		var urlParams = new URLSearchParams(window.location.search);
        var appt_id = urlParams.get('appt_id');

        $.post( api_url+"get_video_chat_details.php", 
        {
          func: "get_opentok_credentials",
          appt_id: appt_id
        })
        .done(function(data){
          console.log(data);
          data = JSON.parse(data);

          if(data.success)
          {
            var apiKey = data.data.opentok_api_key;
            var sessionId = data.data.opentok_session_id;
            var token = data.data.opentok_token;

            // Initialize Session Object
             session = OT.initSession(apiKey, sessionId);
        
           // initialize a publisher
            var publisher = OT.initPublisher('publisher');
        
            session.on({
              streamCreated: function(event) {
                session.subscribe(event.stream, 'subscriber');
              },
              streamDestroyed: function(event) {
                console.log(`Stream ${event.stream.name} ended because ${event.reason}.`);
              },
              sessionConnected: function(event) {
                session.publish(publisher);
              }
            });
        
            session.connect(token, function(error) {
              if (error) {
                console.log(`There was an error connecting to the session: ${error}`);
              }
            });
           


          }
          else
          {
            alert("Not able to establish video call. Please contact Remote Health admin.");
          }

        }) 

        document.addEventListener("backbutton", function (e) {
          e.preventDefault();
          session.disconnect() ;
          history.back(1);
        }, false );

        this.receivedEvent('deviceready');
    },

    endOpenTokCall: function(){
      console.log("inside endOpenTokCall.");    
      session.disconnect() ;
      // session.forceDisconnect(session.connection, function (error) {
      //   if (error) {
      //     console.log(error);
      //   } else {
      //     console.log("Connection forced to disconnect: " + connection.id);
      //   }
      // });
    } , 
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);

        console.log('Received Event: ' + id);
    }
};

app.initialize();
 
function closePatientVideoCall(){
  console.log("close from patient");
  app.endOpenTokCall();
  window.location.href="user_page7.html";
  var urlParams = new URLSearchParams(window.location.search);
  var appt_id = urlParams.get('appt_id');
  
  window.location.href='doctor-review-form17.html?appt_id=appt_id';
}

function closeDoctorVideoCall(){
  console.log("close from doctor");
  app.endOpenTokCall();
 window.location.href='doctor_page27.html';
 // go to upload prescription page
}
