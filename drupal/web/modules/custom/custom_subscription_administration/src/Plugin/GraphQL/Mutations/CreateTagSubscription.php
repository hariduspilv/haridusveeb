<?php

namespace Drupal\custom_subscription_administration\Plugin\GraphQL\Mutations;

use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Drupal\graphql\GraphQL\Execution\ResolveContext;
use Drupal\graphql_core\Plugin\GraphQL\Mutations\Entity\CreateEntityBase;
use Drupal\graphql_core\Plugin\GraphQL\Mutations\Entity\UpdateEntityBase;
use GraphQL\Type\Definition\ResolveInfo;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\custom_graphql_functions\Language\CustomGraphqlLanguageNegotiator;
use Drupal\Core\Language\LanguageManager;
/**
 * Simple mutation for creating a new article node.
 *
 * @GraphQLMutation(
 *   id = "create_tag_subscription",
 *   entity_type = "subscription_entity",
 *   secure = true,
 *   name = "createTagSubscription",
 *   type = "EntityCrudOutput!",
 *   arguments = {
 *     "input" = "SubscriptionInput",
 * 		 "language" = "LanguageId!"
 *   }
 * )
 */
class createTagSubscription extends CreateEntityBase{
	/**
	 * The entity type manager.
	 *
	 * @var \Drupal\Core\Entity\EntityTypeManagerInterface
	 */
	protected $entityTypeManager;
	/**
	 * The Custom Language Negotiator.
	 *
	 * @var \Drupal\custom_graphql_functions\Language\CustomGraphqlLanguageNegotiator
	 */
	protected $CustomGraphqlLanguageNegotiator;
	/**
	 * @inheritDoc
	 */
	public static function create(ContainerInterface $container, array $configuration, $pluginId, $pluginDefinition)
	{
		return new static(
			$configuration,
			$pluginId,
			$pluginDefinition,
			$container->get('entity_type.manager'),
			$container->get('custom_graphql_functions.language_negotiator'),
			$container->get('language_manager'));
	}

	/**
	 * @inheritDoc
	 */
	public function __construct(
		array $configuration,
		$pluginId,
		$pluginDefinition,
		EntityTypeManagerInterface $entityTypeManager,
		CustomGraphqlLanguageNegotiator $CustomGraphqlLanguageNegotiator,
		LanguageManager $languageManager)
	{
		parent::__construct($configuration, $pluginId, $pluginDefinition, $entityTypeManager);
		$this->CustomGraphqlLanguageNegotiator = $CustomGraphqlLanguageNegotiator;
		$this->languageManager = $languageManager;
	}
	/**
	 * @param $value
	 * @param array $args
	 * @param ResolveContext $context
	 * @param ResolveInfo $info
	 * @return array
	 */
	protected function extractEntityInput($value, array $args, ResolveContext $context, ResolveInfo $info){
		return [
			'tag' => $args['input']['tag'],
			'language' => $context->getContext('language', $info),
			'subscriber_email' => $args['input']['email'],
		];
	}
	/**
	 * @inheritDoc
	 */
	public function resolve($value, array $args, ResolveContext $context, ResolveInfo $info)
	{
		$this->languageManager->setNegotiator($this->CustomGraphqlLanguageNegotiator);
		//dump($args);
		// Set new language by its langcode.
		// Needed to re-run language negotiation.
		$this->languageManager->reset();
		$this->languageManager->getNegotiator()->setLanguageCode($args['language']);
		$context->setContext('language', $args['language'], $info);

		$entityTypeId = $this->pluginDefinition['entity_type'];
		$storage = $this->entityTypeManager->getStorage($entityTypeId);
		$entity = $storage->loadByProperties(['subscriber_email' => $args['input']['email']]);
		if(count($entity) > 0){
			$args['id'] = reset($entity)->id();
		}

		if(isset($args['id'])){
			return UpdateEntityBase::resolve($value, $args, $context, $info);
		}else{
			return CreateEntityBase::resolve($value, $args, $context, $info);
		}
	}
}
