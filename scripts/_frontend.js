// This is the frontend's serverside code.
const express = require("express");
const router = express.Router();


// config for the proxy
const MAX_BYTES = 26214400;  // 25 MB
const CONTENT_TYPES = ["image", "video"];

module.exports = {
  path: "/",
  routes() {
    router.use("/", (req,res,n)=>{res.set("Content-Encoding", "gzip"); n()}, /* have to set this because assets are now gzipped */
                    express.static(__dirname + "/dist"));


    router.get("/mproxy", async (req, res)=>{
      try {
        const url = new URL( decodeURIComponent(req.query.url) );
        const client = url.protocol == "https:" ? require('https') : require('http');

        
        const request = client.request(url, (resp) => {

          const ctype = resp.headers["content-type"],
                clength = resp.headers["content-length"];
          
          
          if (clength && parseInt(clength) > MAX_BYTES) {
            return res.status(500).json({err: "request exceeds max bytes"});
          };

          if (ctype && CONTENT_TYPES.some( t => ctype.includes(t) )) {
            res.writeHead(resp.statusCode, resp.headers);
            resp.pipe(res);
          } else {
            res.status(500).json({err: "invalid content type"});
          }
        });
        request.end();
      } catch (e) {
        res.status(500).json({err: "Server Error"});
      }
    });
    return router;
  }
}