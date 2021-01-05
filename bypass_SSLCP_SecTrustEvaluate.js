function bypass_SSLCP_SecTrustEvaluate(){
var resolver = new ApiResolver('module');
var kSecTrustResultProceed = 1;
	try {
		resolver.enumerateMatches('exports:Security!SecTrustEvaluate', {
			onMatch: function (match) {
				var functionName = match['name'];
				var functionAddress = match['address'];
				var SecTrustEvaluate = new NativeFunction(functionAddress, 'int', ['pointer', 'pointer']);
				console.log('\t[+] SecTrustEvaluate found!');
				console.log('\t[+] functionName name: ' + functionName + ' called!');
				Interceptor.replace(functionAddress, new NativeCallback(function(trust, result) {
					var OSStatus = SecTrustEvaluate(trust, result);
					console.log('\t[+] SecTrustEvaluate called!');
					Memory.writeInt(result, kSecTrustResultProceed);
				}, 'int', ['pointer', 'pointer']));
			},
			onComplete: function () {
			}
		});
	}	catch(err) {
			console.log('[-] bypass_SSLCP_SecTrustEvaluate error: ' + err.message);
		}
}

if (ObjC.available) {
	console.log('Objective-C Runtime is available!');
	console.log('Script started!');
	bypass_SSLCP_SecTrustEvaluate();
	console.log('Script executed successfully!');
}	else {
		console.log('Objective-C Runtime is not available!');
	}