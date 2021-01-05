function bypass_SSLCP_URLSession() {
	var resolver = new ApiResolver('objc');
	var NSURLCredential = ObjC.classes.NSURLCredential;
	var SSL_VERIFY_NONE = 0;
	try {
		resolver.enumerateMatches('-[* URLSession:didReceiveChallenge:completionHandler:]', {
			onMatch: function (match) {
				var functionName = match['name'];
				var functionAddress = match['address'];
				Interceptor.attach(functionAddress, {
					onEnter: function(args) {
						var receiver = new ObjC.Object(args[0]);
						var selector = ObjC.selectorAsString(args[1]);
						var challenge = new ObjC.Object(args[3]);
						var completionHandler = new ObjC.Block(args[4]);
						var saved_completionHandler = completionHandler.implementation;
						completionHandler.implementation = function () {
						var credential = NSURLCredential.credentialForTrust_(challenge.protectionSpace().serverTrust());
							try {
								challenge.sender().useCredential_forAuthenticationChallenge_(credential, challenge);
							}	catch(err) {
									console.log('\t[-] ' + functionName + ' error: ' + err.message);
								}
						saved_completionHandler(0, credential);
						}
						console.log('\t[+] ' + functionName + ' called!');
					}
				});
			},
			onComplete: function () {
			}
		});
	}	catch(err) {
			console.log('[-] bypass_SSLCP_URLSession error: ' + err.message);
		}
}

if (ObjC.available) {
	console.log('Objective-C Runtime is available!');
	console.log('Script started!');
	bypass_SSLCP_URLSession();
	console.log('Script executed successfully!');
}	else {
		console.log('Objective-C Runtime is not available!');
	}