<?php

namespace Drupal\htm_custom_oska\Entity;

use Drupal\views\EntityViewsData;

/**
 * Provides Views data for Oska file entity entities.
 */
class OskaFileEntityViewsData extends EntityViewsData {

  /**
   * {@inheritdoc}
   */
  public function getViewsData() {
    $data = parent::getViewsData();

    // Additional information for Views integration, such as table joins, can be
    // put here.

    return $data;
  }

}
