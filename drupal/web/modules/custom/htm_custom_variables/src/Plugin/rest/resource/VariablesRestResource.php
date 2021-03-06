<?php

namespace Drupal\htm_custom_variables\Plugin\rest\resource;

use Drupal\Core\Language\LanguageManagerInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Drupal\Component\FileSystem\RegexDirectoryIterator;

/**
 * Provides a resource to get view modes by entity and bundle.
 *
 * @RestResource(
 *   id = "variables_rest_resource",
 *   label = @Translation("Variables rest resource"),
 *   uri_paths = {
 *     "canonical" = "variables"
 *   }
 * )
 */
class VariablesRestResource extends ResourceBase {

    /**
     * The language manager.
     *
     * @var \Drupal\Core\Language\LanguageManagerInterface
     */
    protected $languageManager;
    /**
     * A current user instance.
     *
     * @var \Drupal\Core\Session\AccountProxyInterface
     */
    protected $currentUser;

    /**
     * Constructs a new BaseSettingsRestResource object.
     *
     * @param array $configuration
     *   A configuration array containing information about the plugin instance.
     * @param string $plugin_id
     *   The plugin_id for the plugin instance.
     * @param mixed $plugin_definition
     *   The plugin implementation definition.
     * @param array $serializer_formats
     *   The available serialization formats.
     * @param \Psr\Log\LoggerInterface $logger
     *   A logger instance.
     * @param \Drupal\Core\Session\AccountProxyInterface $current_user
     *   A current user instance.
     */
    public function __construct(
        array $configuration,
        $plugin_id,
        $plugin_definition,
        array $serializer_formats,
        LoggerInterface $logger,
        AccountProxyInterface $current_user,
        LanguageManagerInterface $languageManager) {
        parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
        $this->currentUser = $current_user;
        $this->languageManager = $languageManager;
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
            $container->get('logger.factory')->get('graphql_custom_translation'),
            $container->get('current_user'),
            $container->get('language_manager')
        );
    }

    /**
     * Responds to GET requests.
     *
     * @param \Drupal\Core\Entity\EntityInterface $entity
     *   The entity object.
     *
     * @return \Drupal\rest\ResourceResponse
     *   The HTTP response object.
     *
     * @throws \Symfony\Component\HttpKernel\Exception\HttpException
     *   Throws exception expected.
     */
    public function get() {
        $config = \Drupal::config('htm_custom_variables.variable');
        $values = $config->get();
        // You must to implement the logic of your REST Resource here.
        // Use current user after pass authentication to validate access.
        if (!$this->currentUser->hasPermission('access content')) {
            throw new AccessDeniedHttpException();
        }
        $current_lang = $this->languageManager->getCurrentLanguage()->getId();

        $values = $this->flatten($values, '', $current_lang);
        $queryMaps['request'] = $this->discoverQueryMaps();
        $values = array_merge($values, $queryMaps);

        $response = new ResourceResponse($values, 200);
        $response->addCacheableDependency($config);

        return $response;
    }

    protected function discoverQueryMaps() {
        $maps = [];
        $lookupPaths = \Drupal::config('graphql.query_map_json.config')->get('lookup_paths');
        foreach ($lookupPaths as $path) {
            if (is_dir($path)) {
                $iterator = new RegexDirectoryIterator($path, '/\.json/i');

                /** @var \SplFileInfo $file */
                foreach ($iterator as $file) {
                    $hash = sha1(file_get_contents($file->getPathname()));
                    $queryName = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file->getFilename());
                    $maps[$queryName] = $hash;
                }
            }

            if (is_file($path)) {
                $file = new \SplFileInfo($path);
                $hash = sha1(file_get_contents($file->getPathname()));
                $queryName = preg_replace('/\\.[^.\\s]{3,4}$/', '', $file->getFilename());
                $maps[$queryName] = $hash;
            }
        }

        return $maps;
    }

    private function flatten($array, $prefix = '', $lang_code) {
        $result = array();
        foreach($array as $key => $value) {
            if($key === 'langcode'){
                continue;
            }else{
                $result[$key] = $value;
            }
        }
        #dump($result);
        return $result;
    }

}
