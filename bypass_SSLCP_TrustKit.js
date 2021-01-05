function bypass_SSLCP_TrustKit() {
var resolver = new ApiResolver('module');
var TSKTrustEvaluationSuccess = 0;
	try {
		resolver.enumerateMatches('exports:TrustKit!verifyPublicKeyPin', {
			onMatch: function (match) {
				var functionAddress = match['address'];
				console.log('\t[+] verifyPublicKeyPin found!');
				Interceptor.replace(functionAddress, new NativeCallback(function(serverTrust, serverHostname, knownPins, hashCache) {
					console.log('\t[+] verifyPublicKeyPin called!');
					return TSKTrustEvaluationSuccess;
				}, 'int', ['pointer', 'pointer', 'pointer', 'pointer']));
			},
			onComplete: function () {
			}
		});
	}	catch(err) {
			console.log('[-] bypass_SSLCP_TrustKit error: ' + err.message);
		}
}

function bypass_SSLCP_TrustKit_Alternative() {
var trustDecision = ObjC.classes.TSKPinningValidator['- evaluateTrust:forHostname:'];
var TSKTrustDecisionShouldAllowConnection = ptr('0x0');
	try {
		Interceptor.attach(trustDecision.implementation, {
			onLeave: function(retval) {
				console.log('\t[+] trustDecision called!');
				console.log('\t[+] Type of return value: ' + typeof retval);
				console.log('\t[+] Return value: ' + retval);
				new_retval = TSKTrustDecisionShouldAllowConnection;
				retval.replace(new_retval);
				console.log('\t[+] New return value: ' + new_retval);
			}
		});
	}	catch(err) {
			console.log('[-] bypass_SSLCP_TrustKit error: ' + err.message);
		}
}

if (ObjC.available) {
	console.log('Objective-C Runtime is available!');
	console.log('Script started!');
	bypass_SSLCP_TrustKit();
	console.log('Script executed successfully!');
}	else {
		console.log('Objective-C Runtime is not available!');
	}