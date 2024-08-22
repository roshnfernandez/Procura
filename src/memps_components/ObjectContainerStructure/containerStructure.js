export const providerDetails = JSON.parse(`{
  "isActive": "Y",
  "providerAddress": "",
  "providerId": "",
  "providerName": "",
  "users": {
    "email": "",
    "password": "",
    "phone": "",
    "username": "",
    "userId": "",
    "roles": {
      "roleId": "PROV",
      "roleName": "PROVIDER"
    },
    "isActive": "Y"
  }
}`);

export const userDetails = JSON.parse(
  `{
  "email": "",
  "password": "",
  "phone": "",
  "username": "",
  "userId": "",
  "roles": {
    "roleId": "",
    "roleName": "SUPPLIER",
    "isActive": "Y"
  },
  "isActive": "Y"
}`
)
export const catalogDetails = JSON.parse(
  `
{
  "catalogId": "",
  "manufacturerName": "",
  "productName": "",
  "categories": {
    "categoryId": "",
    "categoryName": "Diagnostic Equipments",
    "isActive": "Y"
  },
  "isActive": "Y",
  "markedPrice": ""
}
  `
)

export const categoryDetails = JSON.parse(
  `{
    "categoryId": "",
    "categoryName": "",
    "isActive": "Y"
  }`
)
export const equipmentDetails = JSON.parse(
  `{
  "cost": "",
  "equipmentId": "",
  "manufacturedOn": "",
  "purchasedOn": "",
  "serviceDurationInDays": "",
  "serviceDurationInHoursUsed": "",
  "status": "SHIPPED",
  "orderNum": null,
  "catalog": {
    "catalogId": "",
    "manufacturerName": "Allengers",
    "productName": "",
    "categories": {
      "categoryId": "CAT0003",
      "categoryName": "Diagnostic Equipments"
    },
    "isActive": "Y"
  },
  "providers": {
    "isActive": "Y",
    "providerAddress": "204 Rtchie Strt@#$Bangalore@#$Karnataka@#$560037",
    "providerId": "",
    "providerName": "Stannes Ltd",
    "users": {
      "email": "stannes@email.com",
      "password": "12345",
      "phone": "+91 9876543212",
      "username": "Stannes Ltd",
      "userId": "U0001",
      "roles": {
        "roleId": "PROV",
        "roleName": "PROVIDER"
      }
    }
  },
  "isActive": "Y"
}`
)

export const maintenanceDetails = JSON.parse(
  `{
  "id": "",
  "serviceCompletionDate": "",
  "serviceStartDate": "",
  "scheduledStartDate": "",
  "technicianComments": "",
  "technicianName": "",
  "equipment": {
    "cost": 250000,
    "equipmentId": "",
    "manufacturedOn": "2022-07-10T14:14:53.000+00:00",
    "purchasedOn": "2024-07-14T14:15:08.000+00:00",
    "serviceDurationInDays": 360,
    "serviceDurationInHoursUsed": 980,
    "status": "FUNCTIONAL",
    "catalog": {
      "catalogId": "CAT0005",
      "manufacturerName": "Allengers",
      "productName": "GE X Ray Machine",
      "categories": {
        "categoryId": "CAT0003",
        "categoryName": "Diagnostic Equipments"
      },
      "isActive": "Y"
    },
    "providers": {
      "isActive": "Y",
      "providerAddress": "204 Rtchie Strt@#$Bangalore@#$Karnataka@#$560037",
      "providerId": "PROV0001",
      "providerName": "Stannes Ltd",
      "users": {
        "email": "stannes@email.com",
        "password": "12345",
        "phone": "+91 9876543212",
        "username": "Stannes Ltd",
        "userId": "U0001",
        "roles": {
          "roleId": "PROV",
          "roleName": "PROVIDER"
        }
      }
    },
    "isActive": "Y"
  },
  "bills": null,
  "isActive": "Y",
  "status": "INITIATED"
}`
)

export const orderDetails = JSON.parse(
  `{
  "billNumber": "",
  "orderedOn": "",
  "orderNum": "",
  "orderStatus": "PLACED",
  "orderItems": [{
    "itemId": "",
    "quantity": "",
    "order": "",
    "catalog": {
      "catalogId": "",
      "manufacturerName": "",
      "productName": "",
      "categories": {
        "categoryId": "",
        "categoryName": ""
      },
      "isActive": "Y",
      "markedPrice": ""
    },
    "isActive": "Y",
    "estimatedTotal": "",
    "actuaTotal": ""
  }],
  "providers": {
    "isActive": "Y",
    "providerAddress": "",
    "providerId": "",
    "providerName": "",
    "users": {
      "email": "",
      "password": "",
      "phone": "+91 9876543212",
      "username": "Stannes Ltd",
      "userId": "",
      "roles": {
        "roleId": "PROV",
        "roleName": "PROVIDER"
      }
    }
  },
  "isActive": "Y",
  "estimatedTotal": "",
  "actuaTotal": ""
}`
)

export const usageLogDetails = JSON.parse(
  `
  {
  "comments": null,
  "hoursUsed": null,
  "createdOn": "",
  "logId": "",
  "noticedProblems": "N",
  "equipment": {
    "cost": 250000,
    "equipmentId": "",
    "manufacturedOn": "2022-07-10T14:14:53.000+00:00",
    "purchasedOn": "2024-07-14T14:15:08.000+00:00",
    "serviceDurationInDays": 360,
    "serviceDurationInHoursUsed": 980,
    "status": "FUNCTIONAL",
    "catalog": {
      "catalogId": "CAT0005",
      "manufacturerName": "Allengers",
      "productName": "",
      "categories": {
        "categoryId": "CAT0003",
        "categoryName": "Diagnostic Equipments"
      },
      "isActive": "Y",
      "markedPrice": 23000
    },
    "providers": {
      "isActive": "Y",
      "providerAddress": "204 Rtchie Strt@#$Bangalore@#$Karnataka@#$560037",
      "providerId": "PROV0001",
      "providerName": "Stannes Ltd",
      "users": {
        "email": "stannes@email.com",
        "password": "12345",
        "phone": "+91 9876543212",
        "username": "Stannes Ltd",
        "userId": "U0001",
        "roles": {
          "roleId": "PROV",
          "roleName": "PROVIDER"
        }
      }
    },
    "isActive": "Y"
  },
  "users": {
    "email": "rcf@email.com",
    "password": "12345",
    "phone": "9876543201",
    "username": "roshan",
    "userId": "U0004",
    "roles": {
      "roleId": "USR",
      "roleName": "USER"
    }
  }
}
  `
)

export const billDetails = JSON.parse(
  `{
  "billedOn": "2024-07-09T04:48:52.000+00:00",
  "billNumber": "",
  "billItems": [{
    "itemId": "",
    "mpPerUnit": 350000,
    "quantity": 1,
    "spPerUnit": 240000,
    "totalPrice": 240000,
    "catalog": {
      "catalogId": "CAT0005",
      "manufacturerName": "Allengers",
      "productName": "GE X Ray Machine",
      "categories": {
        "categoryId": "CAT0003",
        "categoryName": "Diagnostic Equipments"
      },
      "isActive": "Y",
      "markedPrice": 23000
    },
    "bills": ""
  }],
  "paidOn": "",
  "providers": {
    "isActive": "Y",
    "providerAddress": "254 Rtchie Strt@#$Bangalore@#$Karnataka@#$560037",
    "providerId": "",
    "providerName": "Stannes Ltd",
    "users": {
      "email": "stannes@email.com",
      "password": "12345",
      "phone": "+91 9876543212",
      "username": "Stannes Ltd",
      "userId": "U0001",
      "roles": {
        "roleId": "PROV",
        "roleName": "PROVIDER"
      }
    }
  },
  "isActive": "Y"
}`
)