<?php

namespace Drupal\custom_graphql_elasticsearch_query\Plugin\GraphQL\Fields\ElasticQuery;

use Drupal\Core\DependencyInjection\DependencySerializationTrait;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\graphql\GraphQL\Execution\ResolveContext;
use Drupal\graphql\Plugin\GraphQL\Fields\FieldPluginBase;
use Symfony\Component\DependencyInjection\ContainerInterface;
use GraphQL\Type\Definition\ResolveInfo;
use Elasticsearch\ClientBuilder;
use Drupal\graphql\GraphQL\Buffers\SubRequestBuffer;


/**
 * @GraphQLField(
 *   id = "custom_elasticsearch_query",
 *   secure = true,
 *   type = "[CustomElastic]",
 *   name = "CustomElasticQuery",
 *   arguments = {
 *     "filter" = "CustomElasticFilterInput",
 *   }
 * )
 */
class ElasticQuery extends FieldPluginBase implements ContainerFactoryPluginInterface {
  use DependencySerializationTrait;

	/**
	 * The sub-request buffer service.
	 *
	 * @var \Drupal\graphql\GraphQL\Buffers\SubRequestBuffer
	 */
	protected $subRequestBuffer;

	/**
	 * {@inheritdoc}
	 */
	public static function create(ContainerInterface $container, array $configuration, $pluginId, $pluginDefinition) {
		return new static(
			$configuration,
			$pluginId,
			$pluginDefinition,
			$container->get('graphql.buffer.subrequest')
		);
	}

	/**
	 * Metatags constructor.
	 *
	 * @param array $configuration
	 *   The plugin configuration array.
	 * @param string $pluginId
	 *   The plugin id.
	 * @param mixed $pluginDefinition
	 *   The plugin definition array.
	 */
	public function __construct(
		array $configuration,
		$pluginId,
		$pluginDefinition,
		SubRequestBuffer $subRequestBuffer
	) {
		parent::__construct($configuration, $pluginId, $pluginDefinition);
		$this->subRequestBuffer = $subRequestBuffer;
	}

	/**
	 * {@inheritdoc}
	 */
	public function resolveValues($value, array $args, ResolveContext $context, ResolveInfo $info) {
		$elasticsearch_path = \Drupal::config('elasticsearch_connector.cluster.elasticsearch_cluster')->get('url');
		#$index_path = \Drupal::config('search_api.index'.$args)->;
		if(isset($args['filter']['index'])){
			#$index_path = \Drupal::config('search_api.index.'.$args['filter']['index']);
			$index_path = \Drupal::config('search_api.settings');
		}

		$hosts = [
			[
					'host' => 'elasticsearch',
					'user' => 'elastic',
					'pass' => 'changeme'
			]
		];

		$client = ClientBuilder::create()->setSSLVerification(false)->setHosts($hosts)->build();

		$params = [
		'scroll' => "30s",
		'size' => 50,
		'index' => 'elasticsearch_index_drupaldb_school_loc_index'
		];

		$response = $client->search($params);
		$responsevalues = [];

		while (isset($response['hits']['hits']) && count($response['hits']['hits']) > 0) {

				$responsevalues = array_merge($responsevalues, $response['hits']['hits']);

				// When done, get the new scroll_id
				// You must always refresh your _scroll_id!  It can change sometimes
				$scroll_id = $response['_scroll_id'];

				// Execute a Scroll request and repeat
				$response = $client->scroll([
								"scroll_id" => $scroll_id,  //...using our previously obtained _scroll_id
								"scroll" => "30s"           // and the same timeout window
						]
				);
		}
		foreach($responsevalues as $value){
			//$value = json_encode($value);
			yield $value;
		}
		//yield $this->getQuery($value, $args, $context, $info);
	}

}
