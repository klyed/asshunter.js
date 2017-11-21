//--------------------------------------------------------------------------
//----- AssHat Hunter v0.0.1 || Open Source Anti-Asshat Node.js Script -----
//----- Developed by @KLYE || Free to Use for All! || Free to Modify -------
//----- Rekuirements to run: Node.js + steem.js + node-datetime  -----------
//----- npm install steem --save  ||  npm install node-datetime --save -----
//--------------------------------------------------------------------------
//----- PLEASE DO NOT USE THIS CODE BELOW MALICIOUSLY / FOR EVIL DEEDS -----
//--------------------------------------------------------------------------


//----- CONFIG + Get Rekuirements 

// ***IMPORTANT*** Your Account Name Below (No @)
var hero = 'youraccount';

// ***IMPORTANT*** Your Posting Private Key Below
var herowifkey = '5P0St1nGpR1vK3ys7rz9zJzLGjgHn4aWX79MC6jh3y3W3DJk';

// ***IMPORTANT*** Enter Asshat's Account Below (No @)
var asshat = "asshatsaccount";

// No need to modify these variables
var steem = require('steem');
var dateTime = require('node-datetime');
var dt = dateTime.create();
var totalblocks = 0;
var totalvote = 0;
var totalcomment = 0;

//----- Script Started + Show Time
     var starttime = dt.format('Y-m-d H:M:S');
console.log("===================================================================");
console.log("-------------------------------------------------------------------");
console.log("AssHat Hunter v0.0.1 ONLINE - By @KLYE - Listening to STEEM Network");
console.log("-------------------------------------------------------------------");
console.log("===================================================================");
console.log("---------------- Start Time: " + starttime + " ------------------");
console.log("-------------------------------------------------------------------");
console.log(" ");

//----- Grab Current STEEM Block
steem.api.streamBlockNumber(function(err1, newestblock) {
    totalblocks++
    console.log("-------------------------------------------------------------------");
    console.log("Scanning STEEM Block #" + newestblock + " for Asshat Account @" + asshat);
    console.log("-------------------------------------------------------------------");
    console.log("Blocks Monitored this Session Against Asshats = " + totalblocks);
    console.log("Upvotes This Session Against Asshats = " + totalvote);
    console.log("Comments Flagged This Session Against Asshats = " + totalcomment);
    console.log(" ");
});

//NOTE: Sometimes the Script Fails to Hook Into STEEM. Try Running Script Again if it Fails!


//----- See if Vote is our Target Asshat ----
 var process_vote = function(op) {
      if (op["voter"] == asshat) {
        if(op["weight"] < 0 ){
          totalvote++
          console.log("-------------------------------------------------------------");
          console.log("----- ASSHAT FLAG DETECTED - Deploying Counter Upvote! ------");
          console.log("-------------------------------------------------------------");

          steem.broadcast.vote(
            herowifkey,
            hero,
            op["author"],
            op["permlink"],
            10000,
              function(uperr, result) {
              console.log(uperr, result);
              }
            );
        }
      }
  };
 
//----- See if Comment is our Target Asshat ---- 
 var process_comment = function(op) {
      if (op["author"] == asshat) {
        totalcomment++
        console.log("-------------------------------------------------------------");
        console.log("----- ASSHAT COMMENT DETECTED - Deploying Counter Flag! -----");
        console.log("-------------------------------------------------------------");

        steem.broadcast.vote(
            herowifkey,
            hero,
            op["author"],
            op["permlink"],
            -10000,
              function(downerr, result) {
              console.log(downerr, result);
              }
        );       
      }
  };
