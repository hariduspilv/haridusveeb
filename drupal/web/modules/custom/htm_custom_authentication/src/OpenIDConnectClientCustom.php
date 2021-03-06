<?php

namespace  Drupal\htm_custom_authentication;

use Drupal\Core\Routing\TrustedRedirectResponse;
use Jumbojett\OpenIDConnectClient;
use Drupal\Core\Site\Settings;

/**
 * A wrapper around base64_decode which decodes Base64URL-encoded data,
 * which is not the same alphabet as base64.
 */
function base64url_decode($base64url) {
	return base64_decode(b64url2b64($base64url));
}

/**
 * Per RFC4648, "base64 encoding with URL-safe and filename-safe
 * alphabet".  This just replaces characters 62 and 63.  None of the
 * reference implementations seem to restore the padding if necessary,
 * but we'll do it anyway.
 *
 */
function b64url2b64($base64url) {
	// "Shouldn't" be necessary, but why not
	$padding = strlen($base64url) % 4;
	if ($padding > 0) {
		$base64url .= str_repeat("=", 4 - $padding);
	}
	return strtr($base64url, '-_', '+/');
}

class OpenIDConnectClientCustom extends OpenIDConnectClient {

	protected $tara_secret;

	public function __construct (?string $provider_url = null, ?string $client_id = null, ?string $client_secret = null, $issuer = null) {
		$this->tara_secret = settings::get('tara_secret');
		parent::__construct($provider_url, $client_id, $client_secret, $issuer);
	}


	public function verifyJWTsignature ($jwt) {
		$iss = $this->getIssuer();
		if($iss === 'https://tara-test.ria.ee/oidc'){
			$parts = explode(".", $jwt);
			$body = json_decode(base64url_decode($parts[1]));

			return ($body->aud === 'eduportaal')
							&& ($body->nbf < time('-5 seconds'))
							&& ($body->exp > time('+5 seconds'));
		}else{
			return parent::verifyJWTsignature($jwt);
		}
	}

	public function authenticate () {
		if(!parent::authenticate()){
		}
	}


	protected function urlEncode ($str) {
		$iss = $this->getIssuer();
		if($iss === 'https://tara-test.ria.ee/oidc'){
			$enc = base64_encode($str);
			return $enc;
		}else{
			return parent::urlEncode($str); // TODO: Change the autogenerated stub
		}
	}

	public function redirect ($url) {
		return new TrustedRedirectResponse($url);
	}


}
