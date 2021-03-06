<?php

namespace Drupal\htm_custom_favorites;

use Drupal\Core\Entity\EntityAccessControlHandler;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Access\AccessResult;

/**
 * Access controller for the Favorite entity.
 *
 * @see \Drupal\htm_custom_favorites\Entity\FavoriteEntity.
 */
class FavoriteEntityAccessControlHandler extends EntityAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    /** @var \Drupal\htm_custom_favorites\Entity\FavoriteEntityInterface $entity */
    switch ($operation) {
      case 'view':
        if (!$entity->isPublished()) {
          return AccessResult::allowedIfHasPermission($account, 'view unpublished favorite entities');
        }
        return AccessResult::allowedIfHasPermission($account, 'view published favorite entities');

      case 'update':
        return AccessResult::allowedIfHasPermission($account, 'edit favorite entities');

      case 'delete':
        return AccessResult::allowedIfHasPermission($account, 'delete favorite entities');
    }

    // Unknown operation, no opinion.
    return AccessResult::neutral();
  }

  /**
   * {@inheritdoc}
   */
  protected function checkCreateAccess(AccountInterface $account, array $context, $entity_bundle = NULL) {
    return AccessResult::allowedIfHasPermission($account, 'add favorite entities');
  }

}
