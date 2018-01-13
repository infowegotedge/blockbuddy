'use strict';

let Validator = require('./validators/request.validator');
let apiPath   = process.env.SERVER_PATH + '/api/admin/';

// Get Admin Routes
let AdminRoutes = [
  // GET Settings Request
  {
    method: 'GET',
    path: apiPath + 'settings',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/settings-list')
    }
  }, 
  // GET User List Request
  {
    method: 'GET',
    path: apiPath + 'user-list',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      handler: require('./actions/users/users-list')
    }
  }, 
  // GET User List Request
  {
    method: 'GET',
    path: apiPath + 'orphan-user-list',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      handler: require('./actions/users/orphan-users')
    }
  }, 
  // POST Settings Request
  {
    method: 'POST',
    path: apiPath + 'settings',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getSettingsParameter()
      },
      handler: require('./actions/settings-create')
    }
  }, 
  // GET Withdrawal Request
  {
    method: 'GET',
    path: apiPath + 'withdrawal',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        query: Validator.getWithdrawalsQueryParameter()
      },
      handler: require('./actions/wallets/list-withdrawals')
    }
  },
  // PUT Coins Create Request
  {
    method: 'PUT',
    path: apiPath + 'withdrawal/status/update',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getWithdrawApprovedRejectParameter()
      },
      handler: require('./actions/wallets/withdraw-approved-reject')
    }
  }, 
  // GET Transfer Request
  {
    method: 'GET',
    path: apiPath + 'transfers',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        query: Validator.getTransfersQueryParameter()
      },
      handler: require('./actions/wallets/list-transfers')
    }
  }, 
  // GET Commission Request Of Binary
  {
    method: 'GET',
    path: apiPath + 'commission/binary',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/commission/binary-commission')
    }
  }, 
  // GET Commission Request Of Directs
  {
    method: 'GET',
    path: apiPath + 'commission/direct',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/commission/direct-commission')
    }
  }, 
  // GET Commission Of Repurchase Request
  {
    method: 'GET',
    path: apiPath + 'commission/re-purchase',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/commission/repurchase-commission')
    }
  }, 
  // GET Affiliates Request
  {
    method: 'GET',
    path: apiPath + 'fees/commission',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        query: Validator.getCommissionQueryParameter()
      },
      handler: require('./actions/fees/commission')
    }
  }, 
  // GET List of fees (Withdrawal)
  {
    method: 'GET',
    path: apiPath + 'fees/withdrawal',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        query: Validator.getWithdrawalQueryParameter()
      },
      handler: require('./actions/fees/withdrawal')
    }
  }, 
  // GET List of fees (Transfer)
  {
    method: 'GET',
    path: apiPath + 'fees/transfer',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        query: Validator.getTransferQueryParameter()
      },
      handler: require('./actions/fees/transfer')
    }
  }, 
  // GET List of fees (Transfer Sum)
  {
    method: 'GET',
    path: apiPath + 'fees/transfer-sum',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/fees/transfer-sum')
    }
  }, 
  // GET List of fees (Withdrawal Sum)
  {
    method: 'GET',
    path: apiPath + 'fees/withdrawal-sum',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/fees/withdrawal-sum')
    }
  }, 
  // PUT Request of User Profile Update
  {
    method: 'PUT',
    path: apiPath + 'user/update',
    config: {
      auth: {
        scope: ['admin', 'moderator']
      },
      validate: {
        payload: Validator.getUserUpdateParameter()
      },
      handler: require('./actions/users/user-update')
    }
  }, 
  // PUT Request of User Profile Block
  {
    method: 'PUT',
    path: apiPath + 'user/block',
    config: {
      auth: {
        scope: ['admin', 'moderator']
      },
      validate: {
        payload: Validator.getUserBlockParameter()
      },
      handler: require('./actions/users/user-blocker')
    }
  }, 
  // GET Request of Affiliates List
  {
    method: 'GET',
    path: apiPath + 'affiliates/list',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        query: Validator.getAffiliatesParameter()
      },
      handler: require('./actions/affiliates/list-affiliates')
    }
  }, 
  // PUT Request of Affiliates Update
  {
    method: 'PUT',
    path: apiPath + 'affiliates/update-status',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getAffiliatesUpdateParameter()
      },
      handler: require('./actions/affiliates/update-status')
    }
  }, 
  // POST Request of User Login To Show User Dashboard
  {
    method: 'POST',
    path: apiPath + 'login-as-user',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getLoginAsUserParameter()
      },
      handler: require('./actions/users/grant-access')
    }
  }, 
  // GET Payments List
  {
    method: 'GET',
    path: apiPath + 'admin-payments',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/payments/list')
    }
  }, 
  // POST Payments Update Request
  {
    method: 'POST',
    path: apiPath + 'update-payments',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/payments/update')
    }
  }, 
  // POST User Search Request
  {
    method: 'POST',
    path: apiPath + 'user-search',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/users/search-user')
    }
  }, 
  // POST User Roles Based Login
  {
    method: 'POST',
    path: apiPath + 'user-roles',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getUserRolesParameter()
      },
      handler: require('./actions/users/user-roles')
    }
  },
  // POST Currency Create Request
  {
    method: 'POST',
    path: apiPath + 'currency/create',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getCreateCurrencyParameter()
      },
      handler: require('./actions/currency-coins/create-currency')
    }
  },
  // POST Coins Create Request
  {
    method: 'POST',
    path: apiPath + 'coins/create',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getCreateCoinsParameter()
      },
      handler: require('./actions/currency-coins/create-coin')
    }
  },
  // GET Withdraw By Admin Dashboard Request
  {
    method: 'GET',
    path: apiPath + 'admin-withdrawal',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/wallets/list')
    }
  },
  {
    method: 'GET',
    path: apiPath + 'country-users',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      handler: require('./actions/country-wise-users')
    }
  },
  // GET Commission Create Request
  {
    method: 'GET',
    path: apiPath + 'commission/list',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/commission/list-commission')
    }
  },
  // POST Commission Create Request
  {
    method: 'POST',
    path: apiPath + 'commission/create',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getCreateCommissionParameter()
      },
      handler: require('./actions/commission/create-commission')
    }
  },
  // PUT Commission Update Request
  {
    method: 'PUT',
    path: apiPath + 'commission/update',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getUpdateCommissionParameter()
      },
      handler: require('./actions/commission/update-commission')
    }
  },
  // DELETE Commission Update Request
  {
    method: 'DELETE',
    path: apiPath + 'commission/delete',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getDeleteCommissionParameter()
      },
      handler: require('./actions/commission/delete-commission')
    }
  },
  // DELETE PRODUCT Update Request
  {
    method: 'DELETE',
    path: apiPath + 'product/remove',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.getDeleteProductParameter()
      },
      handler: require('./actions/payments/product-delete')
    }
  },
  // GET PRODUCT Update Request
  {
    method: 'GET',
    path: apiPath + 'notification',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/notifications/list-notifications')
    }
  },
  // POST BroadCast Message Notification Request
  {
    method: 'POST',
    path: apiPath + 'broadcast-notification',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.postBroadCastNotification()
      },
      handler: require('./actions/notifications/broadcast-notification')
    }
  },
  // GET BroadCast Message Notification Request
  {
    method: 'GET',
    path: apiPath + 'list-broadcast-notification',
    config: {
      auth: {
        scope: ['admin', 'user']
      },
      handler: require('./actions/notifications/list-broadcast')
    }
  },
  // PUT BroadCast Message Notification Request
  {
    method: 'PUT',
    path: apiPath + 'update-broadcast',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.updateBroadCastNotification()
      },
      handler: require('./actions/notifications/update-broadcast')
    }
  },

  // CMS ROUTES
  // CMS GET Request
  {
    method: 'GET',
    path: apiPath + 'cms/list',
    config: {
      auth: {
        scope: ['admin']
      },
      handler: require('./actions/cms/list')
    }
  },

  // CMS POST Request
  {
    method: 'POST',
    path: apiPath + 'cms/content',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.postCMSContent()
      },
      handler: require('./actions/cms/create')
    }
  },

  // CMS PUT Request
  {
    method: 'PUT',
    path: apiPath + 'cms/update/content',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.putCMSContent()
      },
      handler: require('./actions/cms/update')
    }
  },

  // CMS PUT De-Activate Request
  {
    method: 'PUT',
    path: apiPath + 'cms/de-activate/content',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.deactivateCMSContent()
      },
      handler: require('./actions/cms/de-activate')
    }
  },

  // CMS DELETE Request
  {
    method: 'DELETE',
    path: apiPath + 'cms/delete/content',
    config: {
      auth: {
        scope: ['admin']
      },
      validate: {
        payload: Validator.deactivateCMSContent()
      },
      handler: require('./actions/cms/delete')
    }
  },
  // Notification Counts Request
  {
    method: 'GET',
    path: apiPath + 'notification-counts',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      handler: require('./actions/notifications-count')
    }
  },
  // Notification Counts Request
  {
    method: 'PUT',
    path: apiPath + 'user/marked-user-old',
    config: {
      auth: {
        scope: ['admin', 'moderator', 'supervisor']
      },
      handler: require('./actions/users/marked-user-old')
    }
  }
];

module.exports = AdminRoutes;