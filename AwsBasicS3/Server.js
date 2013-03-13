// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3/Client.html
// http://aws.amazon.com/pricing/s3/

/*jshint browser: true, devel: true */

var AWS = require('aws-sdk');
var config = AWS.config.loadFromPath('./config.json');
var s3 = new AWS.S3();
var fs = require('fs');
var walk = require('walk');

//var bucketName = 's3bucket03.elvenware.com';
var bucketName = 'bcprog272swahlstrom';
//Note that bucket will be created if not existing


function listBuckets(s3) {
	console.log("calling listBuckets");
	s3.client.listBuckets(function(err, data) {
		if (err) {
			console.log(err);
		} else {
			for (var index in data.Buckets) {
				var bucket = data.Buckets[index];
				console.log("Bucket: ", bucket.Name, ' : ', bucket.CreationDate);
			}
		}
	});
}



function writeFile(localFileName, nameOnS3, binary) {
	// Read in the file, convert it to base64, store to S3
	console.log("writeFile " + nameOnS3);
	fs.readFile(localFileName, function(err, data) {
		if (err) {
			throw err;
		}

		if (binary) {
			console.log("Making binary");
			data = new Buffer(data, 'binary').toString('base64');
		}

		s3.client.putObject({
			ACL: 'public-read',
			Bucket : bucketName,
			Key : nameOnS3,
			Body : data,
			ContentType: 'text/html'
		}, function(resp) {
			console.log('Successfully uploaded ' + nameOnS3);
		});
	});
}

function walkDirs() {
console.log("enter walkdirs");
//Delete index.html

//Copy Part1 to index.html
//NO need to delete if exists, code overwrites
newFile = fs.createWriteStream('index.html');     
oldFile = fs.createReadStream('Part1.html');
newFile.once('open', function(fd){
	console.log("before pump");    
    require('util').pump(oldFile, newFile);
	console.log("after pump");    
}); 
console.log("after Copy");    
console.log("Walkdirs  FollowLinks");
	var options = {
		followLinks : false,
	};

	//var walker = walk.walk("G:/Web/Elvenware/charlie/books/CloudNotes", options);
		console.log("bef .walk");
	var walker = walk.walk("C:/stig/Bellvue College/Prog 272/Week10/AwsBasicS3/AWS_Site", options);


	walker.on("names", function(root, nodeNamesArray) {
	console.log("walker.on names");
		nodeNamesArray.sort(function(a, b) {
			if (a > b)
				return 1;
			if (a < b)
				return -1;
			return 0;
		});
	});

	walker.on("directories", function(root, dirStatsArray, next) {
	console.log("walker.on directories");
		// dirStatsArray is an array of `stat` objects with the additional attributes
		// * type
		// * error
		// * name
		if (typeof dirStatusArray != 'undefined') 
			console.log("Directories: " + dirStatsArray.type);
		next();
	});

	walker.on("file", function(root, fileStats, next) {
		console.log("walker.on file");
		var fileName = root + "/" + fileStats.name;
		var pieces = root.split('/');
		var s3Dir = pieces[pieces.length - 1];
		s3Name = s3Dir + '/' + fileStats.name;
	 	writeFile(fileName, s3Name, false);
		console.log('data to append <li><a href="'+ s3Name + '">f1_1</a></li>');
		fs.appendFile('index.html', '    <li><a href="'+ s3Name + '">' + s3Name +'</a></li>\r\n', function (err) {
});
		//fs.appendFile('message.txt', 'data to append ' + filename, function (err) {

		next();
	});

	walker.on("errors", function(root, nodeStatsArray, next) {
		console.log("walker.on errors");
		console.log(root);
		next();
	});

	walker.on("end", function() {

		console.log("walker.on end, write driving html after appending end piece");
		//Coud do multiple writes but this is OK 
		fs.appendFile('index.html', '</ul>\r\n</body>\r\n</html>', function (err) {
});

		writeFile('index.html', 'index.html', false);
		console.log("all done");
	});

}

walkDirs();
console.log('after walkDirs');


//listBuckets(s3);
