<?php

namespace Drupal\htm_custom_admin_form\Form;

use Drupal\Core\Form\ConfigFormBase;
use Drupal\Core\Form\FormStateInterface;

/**
 * Class CustomAdminForm.
 */
class CustomAdminForm extends ConfigFormBase {

  /**
   * {@inheritdoc}
   */
  protected function getEditableConfigNames() {
    return [
      'htm_custom_admin_form.customadmin',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getFormId() {
    return 'custom_admin_form';
  }

  /**
   * {@inheritdoc}
   */
  public function buildForm(array $form, FormStateInterface $form_state) {
		$form = parent::buildForm($form, $form_state);
		$config = $this->config('htm_custom_admin_form.customadmin');

		$form['tabs'] = [
			'#type' => 'vertical_tabs',
			#'#default_tab' => 'edit-email',
		];

		$form['emails'] = [
			'#type' => 'details',
			'#title' => $this->t('Emails'),
			'#description' => $this->t('Description text here!'),
			'#group' => 'tabs',
		];
			$form['email_event_registration'] = [
				'#type' => 'details',
				'#title' => $this->t('Event emails'),
				'#description' => $this->t('Event registration email settings'),
				'#group' => 'emails',
			];

			/* Do we need this? */
			$form['email_event_registration']['token_tree'] = [
					'#theme' => 'token_tree_link',
					'#token_types' => array('event_reg_entity', 'htm_custom_event_tokens'),
					'#show_restricted' => TRUE,
					'#global_types' => FALSE,
					'#weight' => 90,
			];

			$form['email_event_registration']['fieldset'] = [
				'#type' => 'fieldset',
				'#title' => 'Event registration confirmation'
			];
			$form['email_event_registration']['fieldset']['email_event_registration_subject'] = [
				'#type' => 'textfield',
				'#title' => $this->t('Subject'),
				'#default_value' => $config->get('emails.email_event_registration.registration_email_subject'),
				'#maxlength' => 180,
			];
			$form['email_event_registration']['fieldset']['email_event_registration_body'] = [
				'#type' => 'textarea',
				'#title' => $this->t('Body'),
				'#default_value' => $config->get('emails.email_event_registration.registration_email_body'),
			];

			$form['email_event_registration']['fieldset_2'] = [
				'#type' => 'fieldset',
				'#title' => 'Event organizer notice'
			];
			$form['email_event_registration']['fieldset_2']['email_event_notice_subject'] = [
				'#type' => 'textfield',
				'#title' => $this->t('Subject'),
				'#default_value' => $config->get('emails.email_event_registration.organizer_email_subject'),
				'#maxlength' => 180,
			];
			$form['email_event_registration']['fieldset_2']['email_event_notice_body'] = [
				'#type' => 'textarea',
				'#title' => $this->t('Body'),
				'#default_value' => $config->get('emails.email_event_registration.organizer_email_body'),
			];


		$form['general'] = [
			'#type' => 'details',
			'#title' => $this
					->t('General settings'),
			'#group' => 'tabs',
			'#weight' => -1
		];
		$form['general']['fe_url'] = [
			'#type' => 'url',
			'#title' => $this->t('Front-end location'),
			'#default_value' => $config->get('general.fe_url'),
			'#maxlength' => 255,
			'#size' => 30,
		];

    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function validateForm(array &$form, FormStateInterface $form_state) {
    parent::validateForm($form, $form_state);
  }

  /**
   * {@inheritdoc}
   */
  public function submitForm(array &$form, FormStateInterface $form_state) {
    parent::submitForm($form, $form_state);
    $this->config('htm_custom_admin_form.customadmin')
      ->set('emails.email_event_registration.registration_email_subject', $form_state->getValue('email_event_registration_subject'))
      ->set('emails.email_event_registration.registration_email_body', $form_state->getValue('email_event_registration_body'))
			->set('emails.email_event_registration.organizer_email_subject', $form_state->getValue('email_event_notice_subject'))
			->set('emails.email_event_registration.organizer_email_body', $form_state->getValue('email_event_notice_body'))

			->set('general.fe_url', $form_state->getValue('fe_url'))
      ->save();
  }

}
