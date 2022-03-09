//--------------------------------------------------------------------------
//----- AssHat Hunter v0.0.1 || Open Source Anti-Asshat Node.js Script -----
//----- Developed by @KLYE || Free to Use for All! || Free to Modify -------
//----- Rekuirements to run: Node.js + @hiveio/hive-js + node-datetime  -----------
//----- npm install @hiveio/hive-js --save  ||  npm install node-datetime --save -----
//----- npm install dotenv --save
//--------------------------------------------------------------------------
//----- PLEASE DO NOT USE THIS CODE BELOW MALICIOUSLY / FOR EVIL DEEDS -----
//--------------------------------------------------------------------------

// No need to modify these variables
var hivejs = require("@hiveio/hive-js");
var dateTime = require('node-datetime');
const dotenv = require('dotenv');
dotenv.config();
var dt = dateTime.create();

var hero = process.env.HERO;

var herowifkey = process.env.HERO_WIF_KEY;

var totalblocks = 0;
var totalvote = 0;
var pendingvote = 0;
var totalcomment = 0;
var totalops = 0;
var apiindex = 1;

const apinodes = ["hived.privex.io", "api.deathwing.me", "api.hive.blog", "api.openhive.network", "hive.loelandp.nl", "hive-api.arcange.eu", "rpc.ausbit.dev", "anyx.io"];

hivejs.api.setOptions({ url: "https://api.deathwing.me" });

const masteruser = "klye";

const usernames = ['username1', 'username2'];
const userprivkeys = ['5fjkhasfkjshfkasjfh', '5asdjhasdkjhasdkjashd'];

async function changenode() {
  if (apiindex < apinodes.length){
    apiindex++;
  } else if (apiindex == apinodes.length) {
    apiindex = 0;
  }
  console.log(`CHAIN: Changed API Node to ${apinodes[apiindex]}`);
  await hivejs.api.setOptions({ url: `https://${apinodes[apiindex]}` });
}

  var starttime = dt.format('Y-m-d H:M:S');

  console.log("Vote Cloner v0.0.1 - By @KLYE");
  console.log("Start Time: " + starttime + "\n");

var acctiterate = 0;
  var process_vote = function(op) {
    if (op["voter"] == masteruser) {
      pendingvote++;
      console.log("-------------------------------------------------------------");
      console.log("----- Master Vote DETECTED - Cloning Vote amongst slaves! -----");
      console.log("-------------------------------------------------------------");

      for(acct in usernames) {

                totalvote++
                pendingvote--;
                hivejs.broadcast.vote(userprivkeys[acctiterate], usernames[acctiterate], op["author"], op["permlink"], 10000, function(err, result) { //10000 is 100%
                  console.log(err, result);
                });

              //hivejs.broadcast.comment(herowifkey, op["author"], op["parent_permlink"], hero, op["author"], "WARNING", "<h1>DO NOT CLICK ON THE LINK ABOVE!</h1>\nThe Account above was recently hacked in a phishing attack and is spamming for more victims.", {}, function(err, result) {
              //  console.log(err, result);
              //});
              acctiterate++;
      }

    }
  };

  function parseBlock(blockNum) {
    hivejs.api.getBlock(blockNum, function(err, block) {
      if(err){
        return console.log(`Ooops. Parsed too fast!`);
      }
      if (err !== null) {
        console.log(err);
      };
      if(block){
        block.transactions.forEach((transaction) => {
          transaction.operations.forEach((op) => {
            totalops++;
            var opType = op[0];
            var opgrab = op[1];
            if (opType == "vote") {
              process_vote(opgrab);
            }
          });
        });
      }
    });
  }

  hivejs.api.streamBlockNumber(async function(err1, newestblock) {
    if(err1) changenode();
    if(newestblock) await parseBlock(newestblock);
    totalblocks++
    process.stdout.write(`Master: @${masteruser} - #${newestblock} - Blocks Monitored: ${totalblocks} - Ops Scanned: ${totalops} - Pending Votes: ${pendingvote} - Completed Votes: ${totalvote}`);
    process.stdout.cursorTo(0);
  });
