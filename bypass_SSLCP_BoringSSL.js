function bypass_SSLCP_BoringSSL(){
	try {
			Module.ensureInitialized("libboringssl.dylib");
	}	catch(err) {
			console.log("libboringssl.dylib module not loaded. Trying to manually load it.")
			Module.load("libboringssl.dylib");
		}
	var SSL_VERIFY_NONE = 0;
	var SSL_set_custom_verify;
	var SSL_get_psk_identity;
		try {
			SSL_set_custom_verify = new NativeFunction(
				Module.findExportByName("libboringssl.dylib", "SSL_CTX_set_custom_verify"),
				'void', ['pointer', 'int', 'pointer']
			);
			console.log('\t[+] SSL_CTX_set_custom_verify found!');
			SSL_get_psk_identity = new NativeFunction(
				Module.findExportByName("libboringssl.dylib", "SSL_get_psk_identity"),
				'pointer', ['pointer']
			);
			console.log('\t[+] SSL_get_psk_identity found!');
			function SSL_CTX_set_custom_verify(ctx, out_alert){
				return SSL_VERIFY_NONE;
			}
			var ssl_verify_result_t = new NativeCallback(function (ctx, out_alert){
				SSL_CTX_set_custom_verify(ctx, out_alert);
			},'int',['pointer','pointer']);
			Interceptor.replace(SSL_set_custom_verify, new NativeCallback(function(ctx, mode, callback) {
				SSL_set_custom_verify(ctx, mode, ssl_verify_result_t);
			}, 'void', ['pointer', 'int', 'pointer']));
			Interceptor.replace(SSL_get_psk_identity, new NativeCallback(function(ctx) {
				return "SSL_false_psk_identity";
			}, 'pointer', ['pointer']));
		}	catch(err) {
				console.log('[-] bypass_BoringSSL error: ' + err.message);
			}
}

if (ObjC.available) {
	console.log('Objective-C Runtime is available!');
	console.log('Script started!');
	bypass_SSLCP_BoringSSL();
	console.log('Script executed successfully!');
}   else {
		console.log('Objective-C Runtime is not available!');
	}
