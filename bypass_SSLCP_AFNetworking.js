function bypass_SSLCP_AFNetworking() {
	var resolver = new ApiResolver('objc');
	try {
		resolver.enumerateMatches('*[AFSecurityPolicy evaluateServerTrust:forDomain:]', {
			onMatch: function (match) {
				var functionName = match['name'];
				var functionAddress = match['address'];
				Interceptor.attach(functionAddress, {
					onLeave: function(retval) {
						console.log('\t[+] functionName name: ' + functionName + ' called!');
						console.log('\t[+] Type of return value: ' + typeof retval);
						console.log('\t[+] Return value: ' + retval);
						//new_retval = ptr('0x0');
						//retval.replace(new_retval);
						//console.log('\t[+] New Return value: ' + new_retval);
					}
				});
			},
			onComplete: function () {
			}
		});
		resolver.enumerateMatches('*[AFSecurityPolicy allowInvalidCertificates]', {
			onMatch: function (match) {
				var functionName = match['name'];
				var functionAddress = match['address'];
				Interceptor.attach(functionAddress, {
					onLeave: function(retval) {
						console.log('\t[+] functionName name: ' + functionName + ' called!');
						console.log('\t[+] Type of return value: ' + typeof retval);
						console.log('\t[+] Return value: ' + retval);
						new_retval = ptr('0x1');
						retval.replace(new_retval);
						console.log('\t[+] New return value: ' + new_retval);
					}
				});
			},
			onComplete: function () {
			}
		});
		resolver.enumerateMatches('*[AFSecurityPolicy validatesDomainName]', {
			onMatch: function (match) {
				var functionName = match['name'];
				var functionAddress = match['address'];
				Interceptor.attach(functionAddress, {
					onLeave: function(retval) {
						console.log('\t[+] functionName name: ' + functionName + ' called!');
						console.log('\t[+] Type of return value: ' + typeof retval);
						console.log('\t[+] Return value: ' + retval);
						new_retval = ptr('0x0');
						retval.replace(new_retval);
						console.log('\t[+] New return value: ' + new_retval);
					}
				});
			},
			onComplete: function () {
			}
		});
		resolver.enumerateMatches('*[AFSecurityPolicy SSLPinningMode]', {
			onMatch: function (match) {
				var functionName = match['name'];
				var functionAddress = match['address'];
				Interceptor.attach(functionAddress, {
					onLeave: function(retval) {
						console.log('\t[+] functionName name: ' + functionName + ' called!');
						console.log('\t[+] Type of return value: ' + typeof retval);
						console.log('\t[+] Return value: ' + retval);
						new_retval = ptr('0x0');
						retval.replace(new_retval);
						console.log('\t[+] New return value: ' + new_retval);
					}
				});
			},
			onComplete: function () {
			}
		});
	}	catch(err) {
			console.log('[-] bypass_SSLCP_AFNetworking error: ' + err.message);
		}
}

if (ObjC.available) {
	console.log('Objective-C Runtime is available!');
	console.log('Script started!');
	bypass_SSLCP_AFNetworking();
	console.log('Script executed successfully!');
}	else {
		console.log('Objective-C Runtime is not available!');
	}