const Discord = require("discord.js");
const request = require("request");
const york = new Discord.Client();
var parseString = require("xml2js").parseString;
const config = require("./config.json");

york.on("ready", () => {
  york.user.setActivity("RSS FEED");
  console.log(`YorkUProjects initilized.`);
});

york.on("message", message => {
  if (message.author.york) return;
  if (!message.content.startsWith(config.prefix)) return;

  let command = message.content.split(" ")[0];
  command = command.slice(config.prefix.length);
  let args = message.content.split(" ").slice(1);

  if (command === "getnews") {
    var index = args[0];
    if (!args[0]) {
      return message.channel.send("please add a index 1-24 eg `;getnews [1]`");
    }
    if (args[0] > 24) {
      return message.channel.send("`ERROR Can not provide more news feed`");
    }
    var options = {
      url: "https://yorku.campuslabs.ca/engage/news.rss",
      method: "GET"
    };
    // Start the request
    request(options, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        parseString(body, function(err, result) {

          if(result.rss.channel[0].item[index].enclosure == null){
             return message.channel.send("Error: Unable to get data to complete the feed!");
           }
          console.log(result)
          console.log(result.rss.channel[0].title);
          console.log(result.rss.channel[0].item[index].title);
          console.log(result.rss.channel[0].item[index].link);
          console.log(result.rss.channel[0].item[index].enclosure[0].$.url);
          var mydate = new Date(result.rss.channel[0].item[index].pubDate[0]);
          console.log(mydate.toDateString());
          console.log(result.rss.channel[0].item[index].organization[0]);

          let firstNewTitle = result.rss.channel[0].item[index].title;
          let firstNewLink = result.rss.channel[0].item[index].link;
          let firstNewUrlImage =
            result.rss.channel[0].item[index].enclosure[0].$.url;
          let firstNewDate = mydate.toDateString();
          let firstNewAuth = result.rss.channel[0].item[index].organization[0];

          const embed = new Discord.RichEmbed()
            .setAuthor(`${firstNewAuth}`, york.user.avatarURL)
            .setTitle(`${firstNewTitle}`)
            .setColor(0x00ae86)
            .setImage(`${firstNewUrlImage}`)
            .setTimestamp()
            .setURL(`${firstNewLink}`)
            .addField("Date: ", `${firstNewDate}`);
          message.channel.send({
            embed
          });
        });
      }
    });
  }
});

york.login(config.token);
