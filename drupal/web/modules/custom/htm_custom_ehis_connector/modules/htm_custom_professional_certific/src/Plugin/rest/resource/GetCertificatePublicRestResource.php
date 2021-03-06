<?php

namespace Drupal\htm_custom_professional_certific\Plugin\rest\resource;

use Drupal\Core\Session\AccountProxyInterface;
use Drupal\htm_custom_ehis_connector\EhisConnectorService;
use Drupal\rest\ModifiedResourceResponse;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Hshn\Base64EncodedFile\HttpFoundation\File\Base64EncodedFile;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpFoundation\BinaryFileResponse;
use Symfony\Component\HttpFoundation\ResponseHeaderBag;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "get_certificate_public_rest_resource",
 *   label = @Translation("Get certificate public rest resource"),
 *   uri_paths = {
 *     "canonical" = "/certificate-public-download/{id_code}/{certificate_id}",
 *     "create" = "/certificate-public"
 *   }
 * )
 */
class GetCertificatePublicRestResource extends ResourceBase {

  /**
   * A current user instance.
   *
   * @var \Drupal\Core\Session\AccountProxyInterface
   */
  protected $currentUser;

  /**
   *  Ehis connector service
   *
   * @var EhisConnectorService
   */
  protected $ehisConnector;


	/**
	 * GetCertificatePublicRestResource constructor.
	 *
	 * @param array                 $configuration
	 * @param                       $plugin_id
	 * @param                       $plugin_definition
	 * @param array                 $serializer_formats
	 * @param LoggerInterface       $logger
	 * @param AccountProxyInterface $current_user
	 * @param EhisConnectorService  $ehisConnectorService
	 */
	public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    AccountProxyInterface $current_user,
		EhisConnectorService $ehisConnectorService) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
		$this->ehisConnector = $ehisConnectorService;
    $this->currentUser = $current_user;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('htm_custom_professional_certific'),
      $container->get('current_user'),
      $container->get('htm_custom_ehis_connector.default')
    );
  }


	/**
	 * @param $id_code
	 * @param $certificate_id
	 * @return array|ResourceResponse|mixed|\Psr\Http\Message\ResponseInterface|BinaryFileResponse
	 */
	public function get($id_code, $certificate_id) {
		$params = [
			'id_code' => $id_code,
			'certificate_id' => $certificate_id
		];

		$response = $this->ehisConnector->getCertificatePublic($params);
		if($document = $response['value']['tunnistus']){
			$sym_file = new Base64EncodedFile($document['value']);
			$response = new BinaryFileResponse($sym_file->getRealPath());
			$response->setContentDisposition(
				ResponseHeaderBag::DISPOSITION_ATTACHMENT,
				$document['filename']
			);
			$response->setMaxAge(0);
			return $response;
		}

		return new ResourceResponse('Certificate not found', 404);
	}


	/**
	 * @param $params
	 * @return ModifiedResourceResponse
	 */
	public function post($params) {

    // You must to implement the logic of your REST Resource here.
    // Use current user after pass authentication to validate access.
    if (!$this->currentUser->hasPermission('access content')) {
      throw new AccessDeniedHttpException();
    }
    if(isset($params['id_code']) && isset($params['certificate_id'])){
    	$response = $this->ehisConnector->getCertificatePublic($params);
    	return new ModifiedResourceResponse($response);
    }

    return new ModifiedResourceResponse('Parameters missing', 400);
  }

}
