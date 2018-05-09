var express=require('express');
var app=express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser');
var request = require('request');
var url = require('url');
var fs = require('fs');
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true }));// for parsing application/x-www-form-urlencoded

http.listen(process.env.PORT || 3000);

app.get('/',function(req,res){

  res.sendFile(__dirname+'/index.html');

});

var text;

app.post('/sendnumber', function(req,res){
		// promise to read file
		var readfile = new Promise((resolve,reject)=>{

			request.get('http://terriblytinytales.com/test.txt', function (error, response, body) {
				if (error){
					console.log(error);
				}
			    if (!error && response.statusCode == 200) {
			        text = body;
			    
			    }
			    resolve(text);
			});


		});	
		// after successfully receiving data from file
		readfile.then((data)=>{
		
			data = data.toLowerCase();
			var dictionary={};
			var res_dict=[];

			//replacing special characters
			var regex = /\?ÕÌ_|_Œ‚|[ŠŽÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÑÒÓÔÕÖØÙÚÛÜÝÞßðÿ_]+/gi;
			data = data.replace(regex, ' ')
            .replace(/[^\x00-\x7F]|\?/g, '');

            //creating array of words and replacing next line and tab with space
			data=data.replace( /\n/g, " ").replace( /\t/g, " ").replace( /,/g, " ").split(" ");

			// creating dictonary storing word and frequency in object
			for (var x=0; x<data.length;x++){

				if (data[x]!=""){
					if (!(data[x] in dictionary)){

						dictionary[data[x]]=1;

					}
					else{
						dictionary[data[x]]++;							
					}
				}
				
			}
      
			// sorting object
			keysSorted = Object.keys(dictionary).sort(function(a,b){return dictionary[a]-dictionary[b]});

		
			if (req.body.number>keysSorted.length){

				res.send({"response":"Input a smaller number. There are not enough words"});
				res.end();

			}

			else{

				for (var x=keysSorted.length-1;x>=keysSorted.length-req.body.number;x--){
			
	       				var key_pair={};
	       				key_pair[keysSorted[x]]=dictionary[keysSorted[x]];
	                  		res_dict.push(key_pair);			
				}


			
				res.send(res_dict);
				res.end();
			}
		
		});
			
});
