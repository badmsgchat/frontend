// this contains the main app, messaging window

if (location.path.is('/app')) {
  (()=> {

    var roomid = document.getElementById("roomid").innerText,
        proxyurl = location.origin + "/api/proxyhs?u=",
        ws = new WebSocket('ws://' + location.host);

    // connect
    ws.addEventListener('open', () => {
        ws.send( JSON.stringify({ e:'j', room: roomid }) );
    });
    ws.addEventListener('close', () => {
        console.warn('[ws] closed');
    });
    
    
    var xhr = new XMLHttpRequest();
    function addMessages(data) {
        var md = new showdown.Converter();
        md.setOption("emoji", true);
        md = twemoji.parse(md.makeHtml(data.message), { folder: "svg", ext: ".svg" }); // convert text => md => emojis
        md = DOMPurify.sanitize(md);
    
        var el = $("<div>")
            .attr("id", "msg-"+data.id).addClass("msg")
            .append( $("<img>").attr({
                src: data.pfpuri, class: "pfp"
            }) )

            .append( $("<h4>").text(data.name).css("display", "inline") )         // username
            .append( $("<small>").css("margin-left", "7px")                       // timestamp
                     .text("on " + new Date(1000 * data.created_at).toLocaleDateString("en-us") )
                    )
            .append( $("<a>").on("click", ()=>badmsg.internal.removeid(data.id))  // deletebtn
                             .css("color", "#808080").css("float", "right")
                             .css("margin-right", "50px")
                             .text("🗑") )
            
            .append( $("<pre>").html(md) );
        
        
        if(md) $("#messages").append(el).append($("<hr>"));
        
        $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
        $("a").each((i,tag) => {
            tag.target = "_blank";
        });
        $("img").each((i,tag) => {
            if (tag.src && !tag.src.startsWith(proxyurl)) { tag.src = proxyurl+tag.src };
        });
    }
    


    function getMessages() {
        xhr.open("GET", "/messages?room_id=" + roomid, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                JSON.parse(xhr.responseText).forEach(addMessages);
            }
        }
        xhr.send();
    }
    
    function sendMessage(e) {
        pfpurl = localStorage.getItem("pfpurl");   e.pfpuri = e.pfpuri || "";
        $("#message").val("");

        xhr.open("POST", "/messages/", true);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.onreadystatechange = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
                $("#messages")[0].scrollTop = $("#messages")[0].scrollHeight;
            }
        }
        xhr.send(JSON.stringify(e));
    }
    
    function deleteMessage(id) {
            var msg = $("#msg-"+id);
            if (msg) {
                msg.html("<pre style='color: #808080;'><i>this message was deleted</i></pre>");
            }
    }
    
    $(() => {
            $("#send").on("click", () => {
                    sendMessage({
                        name: $("#name")
                            .val(),
                        message: $("#message")
                            .val(),
                        pfpuri: localStorage.getItem("pfpurl"),
                        room_id: roomid
                    })
                })
            getMessages()
        })
    

    
    ws.addEventListener("message", (e) => {
        const data = JSON.parse(e.data);
        if (data.ev == "msg") return addMessages(data);
        if (data.ev == "rm") return deleteMessage(data.id);
    });
  })();
    
    
    badmsg = {
        internal: {
            settingsExist: false,
            removeid: function(id) {
                if( confirm("are you sure you want to delete this message?") ) {
                    xhr = new XMLHttpRequest();
                    xhr.open("POST", "/messages/delete", true);
                    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
                    xhr.send(JSON.stringify({id: id}));
                }
            }
        },
    
        toggleSettings: function() {
            var e = document.querySelector(".settings-div");
            e ? e.remove() : ((e = document.createElement("div"))
                .classList.add("settings-div"), e.style.position = "fixed", e.style.top = "50%", e.style.left = "50%", e.style.transform = "translate(-50%, -50%)", e.style.padding = "140px", e.style.borderRadius = "10px", e.style.outline = "solid 2px", e.style.outlineColor = "#808080", e.style.backgroundColor = "#000000", e.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.1)", e.innerHTML = `    <h3 id="divtext">Settings</h3>
                <br>
                <input type="url" id="settings_input_pfp" placeholder="your pfp url">
                <br>
                <input type="checkbox" disabled> <text id="divtext">nothing here 👀</text>
                <button id="logout" onclick="location.href=location.origin+'/logout'">Log-out</button>`, document.body.appendChild(e))
        }
    };
    

    // TODO: make prettier
    (()=> {
    var messageInput = document.getElementById("message");
    messageInput.addEventListener("keydown", function(e) {
        13 !== e.keyCode || e.shiftKey ? 13 === e.keyCode && e.shiftKey && (messageInput.value += " ") : "" !== messageInput.value && (e.preventDefault(), document.getElementById("send")
            .click())
    }), document.addEventListener("DOMNodeInserted", function(e) {
        var t;
        e.target.classList.contains("settings-div") && (badmsg.internal.settingsExist = true, (t = document.getElementById("settings_input_pfp"))
            .value = localStorage.getItem("pfpurl"), t.addEventListener("change", function() {
                localStorage.setItem("pfpurl", t.value)
            }))
    }), document.addEventListener("DOMNodeRemoved", function(e) {
        e.target.classList.contains("settings-div") && (badmsg.internal.settingsExist = false)
    }), localStorage.getItem("pfpurl") || localStorage.setItem("pfpurl", "");
    })();
    }