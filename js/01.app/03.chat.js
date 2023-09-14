// TODO: make prettier
// this contains main app code things

if (location.path.is('/app')) {

    var roomid = document.getElementById("roomid").innerText,
        vars_proxyurl = window.location.origin + "/api/proxyhs?u=",
        io = io();
    
    io.emit('join', {roomid: roomid});
    
    (()=> {
    function addMessages(e) {
        var md = new showdown.Converter();
        md.setOption("emoji", !0), md = twemoji.parse(md.makeHtml(e.message), {
                folder: "svg",
                ext: ".svg"
            }), e = $("<div>")
            .attr("id", "msg-"+e.id)
            .addClass("msg")
            .append($("<img>")
                .attr({
                    src: e.pfpuri,
                    class: "pfp"
                }))
            .append($("<h4>")
                .text(e.name)
                .css("display", "inline"))
            .append($("<small>")
                .css("margin-left", "7px")
                .text("on " + new Date(1e3 * e.created_at)
                    .toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric"
                    })
                )
            ).append($("<a>")
                .attr("onclick", `badmsg.internal.removeid('${e.id}')`)
                .attr("style", "color:#808080;float:right;margin-right:50px;")
                .text("🗑"))
            .append($("<pre>").html(md)), $("#messages").append(e).append($("<hr>")),
                 t = document.querySelectorAll("a"), e = document.querySelectorAll("img"), t.forEach(e => {
                e.target = "_blank"
            }), e.forEach(e => {
                var t;
                e.src.startsWith(vars_proxyurl) || (t = e.src, e.src = vars_proxyurl + t)
            });
            $("#messages").scrollTop($("#messages")[0].scrollHeight)
    }
    
    function getMessages() {
        $.get(location.origin + "/messages?room_id=" + roomid, e => {
            e.forEach(addMessages)
        });
    }
    
    function sendMessage(e) {
        pfpurl = localStorage.getItem("pfpurl"), e.pfpuri || (e.pfpuri = ""), $("#message")
            .val(""), pfpurl.value, $.post(location.origin + "/messages/", e, () => {
                $("#messages")
                    .scrollTop($("#messages")[0].scrollHeight)
            })
    }
    
    function eventHandler(e) {
        if (e.type === "delete") {
            var msg = $("#msg-"+e.id);
            if (msg) {
                msg.html("<pre style='color: #808080;'><i>this message was deleted</i></pre>");
            }
        }
    }
    
    $(() => {
            $("#send").click(() => {
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
    
    io.on("message", addMessages);
    io.on("event", eventHandler);
    })();
    
    
    badmsg = {
        internal: {
            settingsExist: false,
            removeid: function(id) {
                if( confirm("are you sure you want to delete this message?") ) {
                    $.post("/messages/delete", { id: id });
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