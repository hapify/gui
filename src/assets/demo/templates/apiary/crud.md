FORMAT: 1A
HOST: https://stage.geev.fr/api/v0.19

# Geev

Geev API

## Facebook authentication [/user/auth/facebook]

Facebook Connect.
The Facebook Connect is available only if the user has an email associated in his Facebook account.

### Registration and login [POST /user/auth/facebook]

+ Request (application/json)

    + Headers
    
            Accept-Language: en-US,en;q=0.5
    
    + Body
    
            {
                "service_token": "EAACUawCyuo8BALZBnJm7AH..."
            }

+ Response 201 (application/json)

    Successful queries. Components info in body.
    The value `new_user` denotes if the user has just been created or was already signed up.
    
    + Body
    
            {
                "user": {
                    "first_name": "Edouard",
                    "last_name": "Demotes",
                    "email": "e.demotes@gmail.com",
                    "picture": "588688c848a63d0010f4579f",
                    "validated": false,
                    "score": 0,
                    "used_credits": [],
                    "active_notifications": true,
                    "street_ad_notifications": true,
                    "donations": [],
                    "streets": [],
                    "requests": [],
                    "review_count": 0,
                    "review_sum": 0,
                    "last_score_update": 1485211848665,
                    "last_login_date": null,
                    "_id": "588688c848a63d0010f457a1",
                    "rank": 1,
                    "credits": {
                        "maximum": 1,
                        "remaining": 1
                    }
                },
                "new_user": true,
                "app_token": "x3JXNx2vl07cpsPk7d7ZM4gnuBA6kLX8FLIrUs15vICAAzsdwhc1jl2gf-HHaGN6A9BT7z2-Nj0FL_hfcQ0PTA"
            }


+ Response 400 (application/json)

    Invalid input.
    This can occure when the request is malformed or the Facebook user has no email address.
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput"
            }
  
+ Response 401 (application/json)

    Invalid Facebook token.
    
    + Body
        
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "InvalidToken"
            }

## Local authentication [/user/auth/local]

Classic login. Note that in these routes, the field `login_id` can be an email or a name.

### Registration [POST /user/auth/local/register]

+ Request (multipart/form-data)

    + Headers
    
            Accept-Language: en-US,en;q=0.5
    
    + Body
    
            {
                "login_id": "jerry@fake.ca",
                "password": "yabilis-rex",
                "first_name": "Jerry",
                "last_name": "Jerrissimo",
                "email": "jerry@fake.ca",
                "gender": "male",
                "picture": "resource..."
            }

+ Response 201 (application/json)

    Successful queries. Components info in body.
    At this point, an email has been sent to the user with the activation link.
    The link has this scheme (`t` is for `token` and `u` for `user_id`):
     - Staging: `https://stage-validation.geev.com/validation?t=xxxx&u=xxxx`
     - Production: `https://validation.geev.com/validation?t=xxxx&u=xxxx`
    
    + Body
    
            {
              "user": {
                "first_name": "Edouard",
                "last_name": "Demotes",
                "email": "e.demotes@gmail.com",
                "picture": "588688c848a63d0010f4579f",
                "validated": false,
                "score": 0,
                "used_credits": [],
                "active_notifications": true,
                "street_ad_notifications": true,
                "donations": [],
                "streets": [],
                "requests": [],
                "review_count": 0,
                "review_sum": 0,
                "last_score_update": 1485211848665,
                "last_login_date": null,
                "_id": "588688c848a63d0010f457a1",
                "rank": 1,
                "credits": {
                  "maximum": 1,
                  "remaining": 1
                }
              },
              "new_user": true
            }


+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
              "statusCode": 400,
              "error": "Bad Request",
              "message": "InvalidInput",
              "validation": {
                "source": "payload",
                "keys": [
                  "login_id"
                ]
              },
              "details": "child \"login_id\" fails because [\"login_id\" is required]"
            }

+ Response 403 (application/json)

    This error comes out when the email cannot be sent to the user.
    It occures when the user has tagged the GEEV sender as spam.
    
    + Body
            
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "RecipientBlocked"
            }

+ Response 409 (application/json)

    An user with this login or email already exists.
    
    + Body
            
            {
                "statusCode": 409,
                "error": "Conflict",
                "message": "UserLoginExists"
            }

### Login [POST /user/auth/local/login]

+ Request (application/json)
    
    + Body

            {
                "login_id": "jerry@fake.ca",
                "password": "yabilis-rex"
            }

+ Response 200 (application/json)

    Successful queries. Components info in body.
    
    + Body
        
            {
                "user": {
                    "_id": "5893908baad9c70010a6926f",
                    "first_name": "Edouard",
                    "last_name": "Demotes",
                    "email": "e.demotes+11@gmail.com",
                    "picture": "5893908baad9c70010a6926d",
                    "validated": true,
                    "score": 0,
                    "used_credits": [],
                    "active_notifications": true,
                    "street_ad_notifications": true,
                    "donations": [],
                    "streets": [],
                    "requests": [],
                    "review_count": 0,
                    "review_sum": 0,
                    "last_score_update": 1486065803771,
                    "last_login_date": 1486426555528,
                    "sponsorship_token": "USER+QKVZTWUKMGV2"
                },
                "new_user": false,
                "app_token": "x3JXNx2vl07cpsPk7d7ZM4gnuBA6kLX8FLIrUs15vICAAzsdwhc1jl2gf-HHaGN6A9BT7z2-Nj0FL_hfcQ0PTA"
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "message": "InvalidInput"
            }
        
+ Response 401 (application/json)

    Invalid password and/or login
    
    + Body
        
            {
                "message": "InvalidPassword"
            }


+ Response 403 (application/json)

    User is not validated.
    
    + Body
            
            {
                "message": "UserNotValidated"
            }
        
### User validation [PATCH /user/validation]

+ Request (application/json)
    
    + Body

            {
                "token": "G8ZYONSJYT22E030O5UJASP26P0GHX39",
                "user_id": "15624ae68bc64cd8613543"
            }

+ Response 200 (application/json)

    Successful queries. Components info in body.
    
    + Body
    
            {
                "user": {
                    "_id": "15624ae68bc64cd8613543",
                    "first_name": "Jerry",
                    "last_name": "Jerrissimo",
                    "email": "jerry@fake.ca",
                    "validated": true,
                    "picture": "123645ecb648"
                },
                "new_user": true
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "message": "InvalidInput"
            }
        
+ Response 404 (application/json)

    User not found
    
    + Body
        
            {
                "message": "NoUserFound"
            }

        
+ Response 401 (application/json)

    Token is not correct
    
    + Body
        
            {
                "message": "TokenMismatch"
            }


+ Response 409 (application/json)

    User already validated
    
    + Body
            
            {
                "message": "UserAlreadyValidated"
            }
        
### Resend validation email [POST /user/validation/resend]

+ Request by email (application/json)
    
    + Body

            {
                "email": "yabilis-rex@gmail.com"
            }
            
+ Request by user_id (application/json)
    
    + Body

            {
                "user_id": "15624ae68bc64cd8613543"
            }

+ Response 204 (application/json)

    At this point, an email has been sent to the user with the activation link.
    The link has this scheme (`t` is for `token` and `u` for `user_id`):
     - Staging: `https://stage-validation.geev.com/validation?t=xxxx&u=xxxx`
     - Production: `https://validation.geev.com/validation?t=xxxx&u=xxxx`
    
    + Body

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "message": "InvalidInput"
            }

+ Response 403 (application/json)

    This error comes out when the email cannot be sent to the user.
    It occures when the user has tagged the GEEV sender as spam.
    
    + Body
            
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "RecipientBlocked"
            }
            
+ Response 404 (application/json)

    User not found
    
    + Body
            
            {
                "message": "NoUserFound"
            }
        
+ Response 409 (application/json)

    User is already validated
    
    + Body
        
            {
                "message": "UserAlreadyValidated"
            }

### Password reset request [POST /user/password/reset]

+ Request (application/json)
    
    + Body

            {
                "email": "jerry@fake.ca"
            }

+ Response 204 (application/json)

    At this point, an email has been sent to the user with the reset link.
    The link has this scheme (`t` is for `token` and `u` for `user_id`):
     - Staging: `https://stage-password.geev.com/password-reset?t=xxxx&u=xxxx`
     - Production: `https://password.geev.com/password-reset?t=xxxx&u=xxxx`
    
    + Body

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "message": "InvalidInput"
            }

+ Response 404 (application/json)

    User not found
    
    + Body
        
            {
                "message": "NoUserFound"
            }
        
+ Response 403 (application/json)

    User is not validated.
    
    If the message is `RecipientBlocked` it means that the email cannot be sent to the user.
    It occures when the user has tagged the GEEV sender as spam.
    
    + Body
        
            {
                "message": "UserNotValidated"
            }
            
### Password reset [PATCH /user/password]

+ Request (application/json)
    
    + Body

            {
                "token": "G8ZYONSJYT22E030O5UJASP26P0GHX39",
                "user_id": "15624ae68bc64cd8613543",
                "password": "yabilis-rex"
            }

+ Response 200 (application/json)

    Successful queries. Components info in body.
    
    + Body
    
            {
                "user": {
                    "_id": "15624ae68bc64cd8613543",
                    "first_name": "Jerry",
                    "last_name": "Jerrissimo",
                    "email": "jerry@fake.ca",
                    "validated": true,
                    "picture": "123645ecb648"
                },
                "new_user": false
            }


+ Response 400 (application/json) 

    Invalid component(s)
    
    + Body
        
            {
                "message": "InvalidInput"
            }
        
+ Response 404 (application/json)

    User not found
    
    + Body
            
            {
                "message": "NoUserFound"
            }

+ Response 401 (application/json)

    Token is not correct
    
    + Body
        
            {
                "message": "TokenMismatch"
            }
        
+ Response 403 (application/json)

    User is not validated
    
    + Body
        
            {
                "message": "UserNotValidated"
            }
            


## User profile [/user/self]

Endpoints to edit and read properties of the current user.

### Get self profile [GET /user/self]

+ Request (application/json)

    Get the information about current user and its current device.
    This routes also returns the list of ads posted by the user.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 200 (application/json)

    Success.
    
    + Body
    
            {
                "user": {
                    "_id": "58a48d43d17a200011c21287",
                    "first_name": "Jean",
                    "last_name": "Michel",
                    "email": "edouard@tractr.net",
                    "picture": "58a48d43d17a200011c21285",
                    "validated": true,
                    "score": 1001500,
                    "used_credits": [],
                    "active_notifications": true,
                    "street_ad_notifications": true,
                    "donations": [
                        {
                            "_id": "5936aa2fc92d0d00183c5b49",
                            "title": "Lots de verres",
                            "type": "donation",
                            "category": "house",
                            "last_update_timestamp": 1496755042,
                            "closed": false,
                            "reserved": false,
                            "given": false,
                            "acquired": false,
                            "favorite": false,
                            "state": "like_new",
                            "complaints": {
                                "spam": 0,
                                "offensive": 0
                            },
                            "pictures": [
                                "5936aa2ec92d0d00183c5b48"
                            ],
                            "creation_timestamp": 1496754735,
                            "unlocked": false,
                            "location": {
                                "longitude": -0.572541,
                                "latitude": 44.834912
                            }
                        }
                    ],
                    "streets": [],
                    "requests": [],
                    "review_count": 0,
                    "review_sum": 0,
                    "last_score_update": 1498725521,
                    "last_login_date": 1499380495,
                    "sponsorship_token": "6YL79",
                    "devices": [
                        "5954bd4cd4adf000157a0fcd",
                        "5954bd69d4adf000157a0fcf"
                    ],
                    "password_reset_code": "Xl9oZSJL9JHfhMDnGY7NPqWzpoiymCyCHz...",
                    "sponsor": {
                        "sponsorship_token": "BORDEAUX",
                        "user_id": "58c029b50faf55001a92c936"
                    },
                    "credits": {
                        "maximum": 10,
                        "remaining": 10
                    },
                    "rank": 8,
                    "ad_alerts": {
                        "maximum": 10
                    },
                    "donation_count": 21,
                    "street_count": 0,
                    "request_count": 0
                },
                "current_device": {
                    "_id": "595ebb0f8e95f30001eb8471",
                    "app_token": "AxlqUgO_qpJSHtEfzrcYlDeFOhAoOKl1p...",
                    "user_id": "58a48d43d17a200011c21287"
                }
            }

+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
### Get self credits [GET /user/self/credits]

+ Request (application/json)

    Get the information about current user credits.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 200 (application/json)

    Success.
    
    + Body
    
            {
                "credits": {
                    "maximum": 10,
                    "remaining": 10
                }
            }

+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }

### Get self ranking [GET /user/self/ranking]

+ Request (application/json)

    Get the ranking for the current user.
    The language of the ranks names can be set in the header.
    The query parameters `info` filter the response.
    It can be `ranks`, `badges` or `position`.
    Example: `/user/self/ranking?info=ranks,position`

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
            Accept-Language: en-US,en;q=0.5

+ Response 200 (application/json)

    Success.
    
    + Body
    
            {
                "ranks": [
                    {
                        "rank": 1,
                        "threshold": 0,
                        "credits": 1,
                        "alerts": 1,
                        "name": "Baby GEEVER",
                        "picture": "5801b16360405d0013dc9c76"
                    },
                    {
                        "rank": 2,
                        "threshold": 500,
                        "credits": 2,
                        "alerts": 2,
                        "name": "Little GEEVER",
                        "picture": "5801b16360405d0013dc9c78"
                    }
                ],
                "badges": [
                    {
                        "_id": "5801b16360405d0013dc9bb0",
                        "title": "Generous GEEVER",
                        "description": "Gift Bonus - 10",
                        "award": 2500,
                        "picture": "5801b16360405d0013dc9c4a",
                        "category": "donation",
                        "position": 1,
                        "acquisition_timestamp": 1499380495
                    },
                    {
                        "_id": "5801b16360405d0013dc9bb1",
                        "title": "Super Generous GEEVER ",
                        "description": "Gift Bonus - 50",
                        "award": 10000,
                        "picture": "5801b16360405d0013dc9c4c",
                        "category": "donation",
                        "position": 2,
                        "acquisition_timestamp": -1
                    }
                ],
                "user_ranking": {
                    "first": {
                        "_id": "58c6d35eb3c5440017e59b94",
                        "first_name": "Vincent",
                        "last_name": "Dub",
                        "picture": "58c6d35eb3c5440017e59b92",
                        "score": 1002400,
                        "position": 1
                    },
                    "second": {
                        "_id": "58a48d43d17a200011c21287",
                        "first_name": "Jean",
                        "last_name": "Michel",
                        "picture": "58a48d43d17a200011c21285",
                        "score": 1001500,
                        "position": 2
                    },
                    "third": {
                        "_id": "58d2d311ce08810019ab4c8c",
                        "first_name": "O_o",
                        "last_name": "O_O",
                        "picture": "58d2d310ce08810019ab4c8a",
                        "score": 1000450,
                        "position": 3
                    },
                    "current": {
                        "_id": "58a48d43d17a200011c21287",
                        "last_name": "Michel",
                        "first_name": "Jean",
                        "picture": "58a48d43d17a200011c21285",
                        "score": 1001500,
                        "position": 2
                    },
                    "previous": {
                        "_id": "58d2d311ce08810019ab4c8c",
                        "first_name": "O_o",
                        "last_name": "O_O",
                        "picture": "58d2d310ce08810019ab4c8a",
                        "score": 1000450,
                        "position": 3
                    },
                    "next": {
                        "_id": "58c6d35eb3c5440017e59b94",
                        "first_name": "Vincent",
                        "last_name": "Dub",
                        "picture": "58c6d35eb3c5440017e59b92",
                        "score": 1002400,
                        "position": 1
                    }
                }
            }

+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            
+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput"
            }

### Update profile [PATCH /user/self]

+ Request (application/json)

    At least one of these parameters is mandatory.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body
    
            {
                "last_name": "Lorem",
                "first_name": "Ut sit eu cillum",
                "current_device_type": "ios",
                "current_device_push_token": "fdsDrSvvvbfdssdsDSDVKKIgv33..."
                "current_device_location": {
                    "coordinates": {
                        "longitude": 14,
                        "latitude": 37
                    },
                    "address": {
                        "value": "Pariatur nisi duis culpa"
                    },
                    "postal_code": {
                        "value": "H2K G3H"
                    }
                }
            }

+ Request (multipart/form-data)

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body
    
            {
                "picture": "resource..."
            }

+ Response 200 (application/json)

    Profile updated.
    
    + Body
    
            {
                "user": {
                    "_id": "589df99d7237ec00018347d2",
                    "first_name": "Jean",
                    "last_name": "Michel le Grand",
                    "email": "e.demotes@gmail.com",
                    "picture": "589e0268aeee7c000164f46d",
                    "validated": true,
                    "score": 0,
                    "used_credits": [],
                    "active_notifications": true,
                    "street_ad_notifications": true,
                    "donations": [],
                    "streets": [],
                    "requests": [],
                    "review_count": 0,
                    "review_sum": 0,
                    "last_score_update": 1486748061164,
                    "last_login_date": 1486748204918,
                    "sponsorship_token": "USER+FVRU6WPA6V8X",
                    "devices": [
                        "589df9a37237ec00018347d3",
                        "589dfa2c7237ec00018347d4"
                    ]
                },
                "new_user": false
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "validation": {
                    "source": "payload",
                    "keys": [
                        "last_name"
                    ]
                },
                "details": "..."
            }


+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            
            
+ Response 429 (application/json)

    Google Maps API returns a "too many requests" response.
    
    + Body
            
            {
                "statusCode": 429,
                "error": "Too Many Requests",
                "message": "TooManyLocations"
            }

### Get user profile [GET /user/{id}]

+ Request (application/json)

    Get the information about another user.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 200 (application/json)

    Success.
    
    + Body
    
            {
                "user": {
                    "_id": "580211077e56a7ce62fb23bb",
                    "first_name": "Vincent",
                    "last_name": "Dubedout",
                    "picture": "58021108cbfe38001451b3d6",
                    "score": 4600,
                    "used_credits": [],
                    "donations": [],
                    "streets": [],
                    "requests": [],
                    "review_count": 3,
                    "review_sum": 11,
                    "last_score_update": 1481122019783,
                    "rank": 3,
                    "credits": {
                        "maximum": 3,
                        "remaining": 3
                    },
                    "last_login_date": 1497970598160,
                    "ad_alerts": {
                        "maximum": 3
                    },
                    "donation_count": 0,
                    "street_count": 1,
                    "request_count": 1
                }
            }

+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            
+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput"
            }

### Logout [POST /user/auth/logout]

+ Request (application/json)

    Will logout the user for the current app token.
    This will also remove the push token associated to this device.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 204 (application/json)

+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            
            
+ Response 429 (application/json)

    The client reached the rate limit
    
    + Body
            
            {
                "statusCode": 429,
                "error": "Too Many Requests",
                "message": "Rate Limit Exceeded"
            }

### Logout from all devices [POST /user/auth/logout/all]

+ Request (application/json)

    Will logout the user from all devices.
    This will also remove the push tokens associated to these devices.
    If the parameter `keep_self` is `true`, then the current device (with this app token) won't be logged out.
    
    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body
    
            {
                "keep_self": true
            }
            
+ Response 204 (application/json)

+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            
            
+ Response 429 (application/json)

    The client reached the rate limit
    
    + Body
            
            {
                "statusCode": 429,
                "error": "Too Many Requests",
                "message": "Rate Limit Exceeded"
            }

## Notifications [/user/self/notifications]

Endpoints to read self notifications.

### Get self notifications [GET /user/self/notifications]

+ Request (application/json)

    This route returns the "In App" notifications of the current user, and set them as read.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 200 (application/json)

    Success. Fields `picture_id`, `event_category`, `event_type`, `event_label`, `read` and `created_at` are mandatory.
    
    `event_category` can be `gamification`, `messaging_inbox`, `messaging_details`, `review`, `ad_list` or `ad_details`.
    
    `event_type` can be `positive`, `negative`, `addition` or `object`.
    
    `event_label` is an HTML text. Only the tags `<b>` and `<i>` may be presents.
    
    + Body
    
            [
                {
                    "picture_id": "588688c848a63d0010f4579f",
                    "event_category": "gamification",
                    "event_type": "positive",
                    "event_label": "Bravo <b>Vincent Dubedout</b>! Tu sais lire",
                    "created_at": 1485211848
                    "sender_id": "588688c848a63d0010f4579f",
                    "recipient_id": "588688c848a63d0010f4579f",
                    "ad_id": "588688c848a63d0010f4579f",
                    "read": false
                }
            ]


+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            

### Count self unread notifications [GET /user/self/notifications/count]

+ Request (application/json)

    This route count the unread "In App" notifications of the current user.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 200 (application/json)

    Success.
    
    + Body
    
            {
                "count": 8
            }


+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            

## Conversations [/user/self/conversations]

Endpoints to read self conversations.

### Count self unread messages [GET /user/self/conversations/count]

+ Request (application/json)

    This route count the unread messages of the current user.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

+ Response 200 (application/json)

    Success.
    
    + Body
    
            {
                "count": 8
            }


+ Response 401 (application/json)

    Error with App Token. `message` can be `AppTokenInvalid` or `AppTokenMissing`
    
    + Body
            
            {
                "statusCode": 401,
                "error": "Unauthorized",
                "message": "AppTokenMissing"
            }
            
### Close all conversation for an ad [PATCH /ad/{adId}/conversations]

+ Request (application/json)

    The endpoint is only callable by the ad's author. It will close all conversations.
    If the ad is not acquired yet and have a selected recipient, the conversation with this recipient will be kept.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

    + Body
    
            {
                "closed": true
            }
            
+ Response 204 (application/json)

+ Response 403 (application/json)

    Sent if the user is not the author.
    
    + Body
            
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotAdAuthor"
            }

+ Response 404 (application/json)
    
    Sent if no ad was found.

    + Body
            
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoAdFound"
            }
            
## Ads [/ads]

Routes to create, edit and search ads

### Search [GET /ads{?_id,page,page_length,location,distance,elastic_threshold,type,reserved,closed,validated,keywords,category,state,from,to,presentation,sort}]

+ Parameters
            
    + _id - Object Id, 24 characters hexadecimal.
    + page - number, greater than 1 or equal. Required when `distance` is defined.
    + page_length - number, between 1 and 200 included.
    + location - string, formatted as `45.5145339,-73.5745070`. First is `longitude`, second part is `latitude`. Required if the header `X-Geev-Token` is missing (usage as guest). `longitude` number, between -180 and  180 included. `latitude` numbe,r between -90 and  90 included.
    + distance - number, between 1000 and 50000 included (in meters). Default is 1000.
    + `elastic_threshold` - number, between 1 and 400 included. Default is 200. Forbidden if distance or _id are defined.
    + type - string, formatted as `street,donation`. Allowed values : `street`, `donation` and `request`. At least one value if defined.
    + reserved - boolean.
    + closed - boolean.
    + validated - string, can be `true`, `false` or `any`. This parameters is ignored for non-admin users.
    + keywords - string, length between 1 and 300 included.
    + category - string, can be `clothing`, `vehicle`, `phone_related`, `sport`, `baby_related`, `furniture`, `professional_equipment`, `house`, `book`, `toy`, `video_game`, `electronics`, `home_appliance`, `miscellaneous`, `art`, `footwear`, `home_improvement` or `accessory`.
    + state - string, can be `broken`, `worn` or `like_new`.
    + from - timestamp (unix)
    + to - timestamp (unix)
    + presentation - string, can be `full`, `summary` or `minimal`. Required.
    + sort - string, can be `distance` or `creation`. Default is `creation`.
    
+ Request (application/json)
    
    The user's token `X-Geev-Token` in the header is optionnal. This route can be used as guest.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

    + Body
    
            {
                "_id": "588688c848a63d0010f4579f",
                "page": 2,
                "page_length": 30,
                "location": "45.5145339,-73.5745070",
                "distance": 20000,
                "elastic_threshold": 50,
                "type": "street,donation",
                "reserved": "false",
                "closed": "true",
                "validated": "any",
                "keywords": "meuble",
                "category": "baby_related",
                "state": "broken",
                "from": 13564891600,
                "to": 13564693600,
                "presentation": "full",
            }

+ Response 200 (application/json)

    Successful queries. Search results in body.
    
    + Body
    
            {
                "page": 1,
                "page_count": 24,
                "ads": [
                    {
                        "_id": "58a5d5038e37e2001432aa7f",
                        "title": "maison dans les Cévennes",
                        "type": "donation",
                        "category": "miscellaneous",
                        "last_update_timestamp": 1487265857,
                        "closed": false,
                        "reserved": false,
                        "given": false,
                        "acquired": false,
                        "author": {
                            "_id": "58a5c9ab8e37e2001432aa6f",
                            "first_name": "Flo",
                            "last_name": "Tauz",
                            "picture": "58a5e2c5858d6c0014d32d88"
                        },
                        "description": "ensoleillé",
                        "state": "broken",
                        "complaints": {
                            "spam": 0,
                            "offensive": 0
                        },
                        "pictures": [
                            "58a5d5028e37e2001432aa7d"
                        ],
                        "city": "Bordeaux",
                        "country": "France",
                        "creation_timestamp": 1487262979,
                        "unlocked": false,
                        "location": {
                            "longitude": -0.5613635750808936,
                            "latitude": 44.84136955699687,
                            "obfuscated": true,
                            "radius": 1000
                        }
                    }
                ]
            }


+ Response 404 (application/json)

    Successful queries, but not results.
    
    + Body
    
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoAdFound"
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [
                    {
                        "message": "\"page\" must be a number",
                        "path": "page",
                        "type": "number.base",
                        "context": {
                            "key": "page"
                        }
                    }
                ]
            }

### Search for chat bot [GET /ads/chat-bot{?template,page,page_length,location,address,type,reserved,closed,keywords,category,state,presentation,language,sort}]

+ Parameters
            
    + template - string, The Messenger's cards template. Can be `list` or `generic`. Default to `generic`.
    + page - number, greater than 1 or equal.
    + page_length - number, between 1 and 10 included. If `template` is `list`, max is 4.
    + location - string, formatted as `45.5145339,-73.5745070`. First is `longitude`, second part is `latitude`. Required if the header `X-Geev-Token` is missing (usage as guest). `longitude` number, between -180 and  180 included. `latitude` numbe,r between -90 and  90 included.
    + address - string, Readable by Google Geocoder. Overrides `location`. Must be defined if `location` is missing.
    + type - string, formatted as `street,donation`. Allowed values : `street`, `donation` and `request`. Default is `donation`.
    + reserved - boolean. Default is `false`.
    + closed - boolean. Default is `false`.
    + keywords - string, length between 1 and 300 included.
    + category - string, As for route `GET /ads`. Aliases are also available. See file `app/plugins/ad-search/methods/transform-category.js`.
    + state - string, can be `broken`, `worn` or `like_new`.
    + presentation - string, can be `full`, `summary` or `minimal`. Default is `full`.
    + sort - string, can be `distance` or `creation`. Default is `creation`.
    + language - string, The language used by the bot for answers. Default is `fr`;
    
+ Request (application/json)

+ Response 200 (application/json)

    Successful queries. Search results in body.
    
    + Body
    
            {
                "messages": [
                    {
                        "text": "J'ai trouvé 154 annonces!"
                    },
                    {
                        "text": "Voici les 2 premières."
                    },
                    {
                        "attachment": {
                            "type": "template",
                            "payload": {
                                "template_type": "list",
                                "top_element_style": "large",
                                "elements": [
                                    {
                                        "title": "Lots de verres",
                                        "subtitle": "51j - 2km - Différents verres en verre, couleur verre.",
                                        "image_url": "https://stage.geev.fr/api/v0.19/picture/598882472491a7001a7dccf7",
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": "https://share.geev.com/ad/598882472491a7001a7dccf8",
                                                "title": "Voir l'annonce"
                                            }
                                        ]
                                    },
                                    {
                                        "title": "Livres anglais",
                                        "subtitle": "82j - 1km - 4 livres sur l'anglais  :  un dictionnaire, un sur la grammaire, un sur le vocabulaire et un dictionnaire d'argot",
                                        "image_url": "https://stage.geev.fr/api/v0.19/picture/595ea3336ca4ca001912b28e",
                                        "buttons": [
                                            {
                                                "type": "web_url",
                                                "url": "https://share.geev.com/ad/595ea3346ca4ca001912b28f",
                                                "title": "Voir l'annonce"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                    },
                    {
                        "text": "Veux-tu voir plus d'annonces ?",
                        "quick_replies": [
                            {
                                "title": "Voir plus d'annonces",
                                "block_names": [
                                    "Search - API"
                                ]
                            },
                            {
                                "title": "Recommencer",
                                "block_names": [
                                    "Search - User inputs"
                                ]
                            },
                            {
                                "title": "Menu principal",
                                "block_names": [
                                    "Search - End"
                                ]
                            }
                        ]
                    }
                ],
                "set_attributes": {
                    "searchPage": 2
                }
            }


+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [{}]
            }

### Reserve [PUT /ad/{id}/reservation]

+ Request (application/json)
    
    Will flag the ad as "reserved" for the selected recipient.
    The id of the recipient is in the payload.
    
    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

    + Body
    
            {
                "recipient": "58a5d5038e37e2001432aa7f"
            }

+ Response 201 (application/json)
        
+ Response 403 (application/json)

    The user is not the ad author
    
    + Body
    
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotAdAuthor"
            }

+ Response 404 (application/json)

    The recipient is not found. This can also be `NoAdFound`.
    
    + Body
    
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoRecipientFound"
            }

+ Response 409 (application/json)

    A conflict occured. A conflict can be `AdClosed`, `AdGiven`, `AdAlreadyReserved` or `NotDonationAd`.
    
    + Body
    
            {
                "statusCode": 409,
                "error": "Conflict",
                "message": "AdAlreadyReserved"
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [
                    {
                        "message": "\"recipient_id\" is required",
                        "path": "recipient_id",
                        "type": "any.required",
                        "context": {
                            "key": "recipient_id"
                        }
                    }
                ]
            }


### Unreserve [DELETE /ad/{id}/reservation]

+ Request (application/json)
    
    Will unflag the ad as "reserved" for the current selected recipient.
    The reason of the cancellation is in the payload.
    The reason can be `prefer_other_recipient`, `no_show`, `no_news`, `keeping_it` or `other_reason`.
    
    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK

    + Body
    
            {
                "reason": "prefer_other_recipient"
            }

+ Response 204 (application/json)
        
+ Response 403 (application/json)

    The user is not the ad author
    
    + Body
    
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotAdAuthor"
            }

+ Response 404 (application/json)

    The ad is not found.
    
    + Body
    
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoAdFound"
            }

+ Response 409 (application/json)

    A conflict occured. A conflict can be `AdClosed`, `AdGiven`, `AdNotReserved` or `NotDonationAd`.
    
    + Body
    
            {
                "statusCode": 409,
                "error": "Conflict",
                "message": "AdNotReserved"
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput"
            }
            

## Picture [/picture]

Get an image

### Get [GET /picture/{id}]

+ Request (application/json)
    
    Query options (all optional):
    
    - `greyscale`, value can be `false` or `true`.
    - `width`, value between `50` and `2000`.
    - `height`, value between `50` and `2000`.
    - `method`, value can only `crop` or `contain` (default is `contain`).
    
    While resizing image, the image will never be up-scaled, and ratio never changed.
    Width and height will be applied as maximums.
    
    + Body

+ Response 200

    Successful queries. Content in response
        
    + Body
        
            ...image data...

+ Response 404 (application/json)

    Successful queries, but not results.
    
    + Body
    
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "PictureNotFound"
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "validation": {
                    "source": "query",
                    "keys": [
                        "greyscale"
                    ]
                },
                "details": "child \"greyscale\" fails because [\"greyscale\" must be one of [true, false]]"
            }


## Debug [/debug]

Endpoints to enable debugging features.

### Enable user tracking [POST /debug/user/track]

+ Request (application/json)

    Will enable calls tracking for a single user in Kibana.
    One of these parameters is required: `user_id`, `email`, `login_id`.

    + Headers
    
            X-Geev-Debug-Token: a98o7VTbaH6WMDsd082q7GTo76gU1805

    + Body
    
            {
                "email": "email@gmail.com"
            }

+ Response 204 (application/json)

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "validation": {
                    "source": "payload",
                    "keys": [
                        "user_id"
                    ]
                },
                "details": "..."
            }


### Disable user tracking [DELETE /debug/user/track]

+ Request (application/json)

    Will disable calls tracking for a single user in Kibana.
    One of these parameters is required: `user_id`, `email`, `login_id`.

    + Headers
    
            X-Geev-Debug-Token: a98o7VTbaH6WMDsd082q7GTo76gU1805

    + Body
    
            {
                "email": "email@gmail.com"
            }

+ Response 204 (application/json)

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "validation": {
                    "source": "payload",
                    "keys": [
                        "user_id"
                    ]
                },
                "details": "..."
            }

### Test error throw [GET /debug/throw-error]

+ Request (application/json)

    Will force generate a server error to test logging in Kibana.

    + Headers
    
            X-Geev-Debug-Token: a98o7VTbaH6WMDsd082q7GTo76gU1805

+ Response 200 (application/json)

+ Response 502 (application/json)

    Error thrown
    
    + Body
        
            {
                "statusCode": 502,
                "error": "Bad Gateway",
                "message": "This is a test error"
            }

## Information [/info]

Endpoints for server information.

### Get API version info [GET /version]

+ Request (application/json)

+ Response 200 (application/json)
    
    Get the current and deprecated versions.
    
    + Body
        
            {
                "current_api_version": "0.19",
                "warn_api_below": null,
                "block_api_below": null
            }


## Admin [/admin]

Endpoints for admin methods.

### Get the users list [POST /admin/user/list]

+ Request (application/json)

    Get the list of users, based on Datatables [protocol](https://datatables.net/manual/server-side).
    The user should have the `user:GET` privilege.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body
    
            {
               "draw":3,
               "columns":[
                  {
                     "data":"first_name",
                     "name":"Prénom",
                     "searchable":true,
                     "orderable":false,
                     "search":{
                        "value":"",
                        "regex":false
                     }
                  },
                  {
                     "data":"last_name",
                     "name":"Nom",
                     "searchable":true,
                     "orderable":true
                  },
                  {
                     "data":"email",
                     "searchable":true,
                     "orderable":true
                  }
               ],
               "order":[
                  {
                     "column":3,
                     "dir":"desc"
                  }
               ],
               "start":0,
               "length":25,
               "search":{
                  "value":"{}",
                  "regex":false
               }
            }

+ Response 200 (application/json)
    
    + Body
        
            {
               "draw":3,
               "recordsTotal":2,
               "recordsFiltered":2,
               "data":[
                  [
                     "Angelica",
                     "Ramos",
                     "ramos@gmail.com"
                  ],
                  [
                     "Ashton",
                     "Cox",
                     "cox@gmail.com"
                  ]
               ]
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "validation": {
                    "source": "payload",
                    "keys": [
                        "columns"
                    ]
                },
                "details": "..."
            }

+ Response 403 (application/json)

    The current user has not the privilege to access this.
    
    + Body
        
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotPermitted"
            }
            
### Get the ads list [POST /admin/ad/list]

+ Request (application/json)

    Get the list of ads, based on Datatables [protocol](https://datatables.net/manual/server-side).
    The user should have the `ad:GET` privilege.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body
    
            {
               "draw":3,
               "columns":[
                  {
                     "data":"title",
                     "name":"Titre",
                     "searchable":true,
                     "orderable":true,
                     "search":{
                        "value":"jeu",
                        "regex":false
                     }
                  },
                  {
                     "data":"description",
                     "name":"Description",
                     "searchable":true,
                     "orderable":true
                  }
               ],
               "order":[
                  {
                     "column":1,
                     "dir":"desc"
                  }
               ],
               "start":0,
               "length":25,
               "search":{
                  "value":"",
                  "regex":false
               }
            }

+ Response 200 (application/json)
    
    + Body
        
            {
                "draw": 3,
                "recordsTotal": 2,
                "recordsFiltered": 2,
                "data": [
                    [
                        "Jeu pour enfant",
                        "En bon état"
                    ],
                    [
                        "Jeu de société",
                        "En bon état"
                    ]
                ]
            }

+ Response 400 (application/json)

    Invalid component(s)
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "validation": {
                    "source": "payload",
                    "keys": [
                        "columns"
                    ]
                },
                "details": "..."
            }

+ Response 403 (application/json)

    The current user has not the privilege to access this.
    
    + Body
        
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotPermitted"
            }
            
### Get a User [GET /admin/user/{id}]

+ Request (application/json)

    Get all details about a User.
    The user should have the `user:GET` privilege.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body

+ Response 200 (application/json)
    
    + Body
        
            {
                "_id": "58029f787e56a7ce62fb23d6",
                "login_service": "facebook",
                "login_id": "10154568871168077",
                "first_name": "Thomas",
                "last_name": "Airviyard",
                "email": "totom_@hotmail.com",
                "gender": "male",
                "picture": "58029f78cbfe38001451b42b",
                "score": 0,
                "used_credits": [],
                "active_notifications": true,
                "street_ad_notifications": true,
                "donations": [
                    {
                        "_id": "5803b2a11a266d0013a93949",
                        "title": "test d'application",
                        "type": "donation",
                        "category": "baby_related",
                        "location": {
                            "longitude": 2.3310526,
                            "latitude": 48.8640493
                        },
                        "obfuscated_location": {
                            "longitude": 2.3376478863124546,
                            "latitude": 48.86888379659861,
                            "obfuscated": true,
                            "radius": 1000
                        },
                        "creation_timestamp": "2016-10-16T17:02:25.971Z",
                        "last_update_timestamp": "2016-10-16T17:02:25.971Z",
                        "complaints": {
                            "spam": 0,
                            "offensive": 0
                        },
                        "closed": true,
                        "pictures": [
                            "5803b2a11a266d0013a93947"
                        ],
                        "state": "worn",
                        "reserved": true,
                        "given": true,
                        "validated": true,
                        "acquired": false
                    },
                    ...
                ],
                "streets": [],
                "requests": [],
                "review_count": 1,
                "review_sum": 1.6666666666666667,
                "last_score_update": 1476685470487,
                "rank": 1,
                "credits": {
                    "maximum": 1,
                    "remaining": 1
                },
                "sponsorship_token": "XBLKI",
                "lock": {
                    "active": false,
                    "timestamp": 1476637082769
                },
                "device_list": [
                    {
                        "_id": "58029f78cbfe38001451b42d",
                        "app_token": "8hguykR-08tKeBfsS7zqpelGsmGH9kc-17M-c5fOI5l1elPnxvY_unlsB3EKRXFxmAW9xNdNjDfjhdLejifBDA",
                        "user_id": "58029f787e56a7ce62fb23d6",
                        "push_token": "f6917Kxug8A:APA91bE7NH98EdASJYA-XZeh1O7TdQncABmOd5ARavvjfvKyZuKYtLc9no46x5m4KjmNy2hGfp94dXhZRUggyPmw8b749mD1f3O76u5-1QWVFH1kUom9eDPp0RuuGrfTfYw9vr3w5WlK",
                        "type": "android",
                        "location": {
                            "latitude": 43.4456473,
                            "longitude": 1.4531355
                        }
                    },
                    ...
                ],
                "complaint_list": [],
                "user_action_rewards_list": [],
                "user_gamification_sheets_list": [
                    {
                        "_id": "58029f787e56a7ce62fb23d6",
                        "resources": {
                            "donation_ad": {
                                "creation": 0,
                                "closing": 0,
                                "donation": 0,
                                "acquisition": 0,
                                "response": 0
                            },
                            "street_ad": {
                                "creation": 0,
                                "closing": 0,
                                "acquisition": 0,
                                "sighting": 0
                            },
                            "request_ad": {
                                "creation": 0,
                                "closing": 0,
                                "response": 0
                            },
                            "ad": {
                                "creation": 0,
                                "closing": 0,
                                "donation": 0,
                                "acquisition": 0,
                                "response": 0,
                                "sighting": 0
                            },
                            "user": {
                                "review": 0,
                                "sponsorship": 0,
                                "sponsorship_reception": 0
                            },
                            "cumulative_days_visited": 1
                        },
                        "badges": {},
                        "lastVisitedDay": 17089
                    },
                    ...
                ],
                "review_sent_list": [
                    {
                        "_id": "58046e9d7e56a7ce62fb2414",
                        "ad_id": "5803b2a11a266d0013a93949",
                        "recipient_id": "5802c1e67e56a7ce62fb23db",
                        "reviewer": {
                            "_id": "58029f787e56a7ce62fb23d6",
                            "first_name": "Thomas",
                            "last_name": "Airviyard",
                            "picture": "58029f78cbfe38001451b42b"
                        },
                        "scores": [
                            5,
                            4,
                            5
                        ],
                        "feedback": "super cool",
                        "timestamp": "2016-10-17T06:24:30.108Z"
                    },
                    ...
                ],
                "review_received_list": [
                    {
                        "_id": "5841923c661f7ef5ec8c80ce",
                        "ad_id": "580295a51a266d0013a9389e",
                        "recipient_id": "58029f787e56a7ce62fb23d6",
                        "reviewer": {
                            "_id": "580277cf7e56a7ce62fb23c0",
                            "first_name": "Erwan",
                            "last_name": "Geev",
                            "picture": "580277d0cbfe38001451b3ed"
                        },
                        "scores": [
                            2,
                            ...
                        ],
                        "feedback": "snif",
                        "timestamp": "2016-12-02T15:24:57.879Z"
                    },
                    ...
                ]
            }

+ Response 400 (application/json)

    Invalid User Id
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [
                    {
                        "message": "\"user_id\" length must be 24 characters long",
                        "path": "user_id",
                        "type": "string.length",
                        "context": {
                            "limit": 24,
                            "value": "58029f787e56a7ce62fb23d6z",
                            "key": "user_id"
                        }
                    }
                ]
            }

+ Response 403 (application/json)

    The current user has not the privilege to access this.
    
    + Body
        
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotPermitted"
            }
            
+ Response 404 (application/json)

    User not found
    
    + Body
        
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoUserFound"
            }
            
### Get an Ad [GET /admin/ad/{id}]

+ Request (application/json)

    Get all details about an Ad.
    The user should have the `ad:GET` privilege.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body

+ Response 200 (application/json)
    
    + Body
        
            {
                "_id": "5878fb942fca690016f1a76d",
                "title": "Table basse Conforama légèrement abîmée ",
                "description": "Je vends ma table basse qui a 2 ans. Elle est légèrement abîmée sur un côté et sur le dessus (cf photos) elle est marron foncée. À venir récupérer je ne me déplace pas. 20€",
                "type": "donation",
                "category": "furniture",
                "location": {
                    "longitude": -0.5687341,
                    "latitude": 44.8300276
                },
                "obfuscated_location": {
                    "longitude": -0.5677746016140754,
                    "latitude": 44.824349738560336,
                    "obfuscated": true,
                    "radius": 1000
                },
                "creation_timestamp": "2017-01-13T16:08:52.836Z",
                "last_update_timestamp": "2017-03-01T17:40:10.809Z",
                "complaints": [
                    {
                        "_id": "587a2359672dc4cf1d96fcae",
                        "ad_id": "5878fb942fca690016f1a76d",
                        "user_id": "585a4561672dc4cf1d96f528",
                        "complaint": "offensive"
                    },
                    ...
                ],
                "closed": true,
                "validated": true,
                "author": {
                    "_id": "5878fa64672dc4cf1d96fc73",
                    "first_name": "Méghane",
                    "last_name": "Maçon",
                    "picture": "5878fac9447ac90014056e2c"
                },
                "pictures": [
                    "5878fb942fca690016f1a762",
                    ...
                ],
                "state": "worn",
                "reserved": false,
                "given": false,
                "acquired": false,
                "lock": {
                    "active": false,
                    "timestamp": 1488321382190
                },
                "potential_chosen": [
                    "587b5bd9672dc4cf1d96fd08",
                    ...
                ],
                "reservation_cancellation_list": []
            }

+ Response 400 (application/json)

    Invalid Ad Id
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [
                    {
                        "message": "\"ad_id\" length must be 24 characters long",
                        "path": "ad_id",
                        "type": "string.length",
                        "context": {
                            "limit": 24,
                            "value": "5878fb942fcaf690016f1a76d",
                            "key": "ad_id"
                        }
                    }
                ]
            }

+ Response 403 (application/json)

    The current user has not the privilege to access this.
    
    + Body
        
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotPermitted"
            }
            
+ Response 404 (application/json)

    Ad not found
    
    + Body
        
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoAdFound"
            }
            
### Disable a user [PATCH /admin/user/{id}/disable]

+ Request (application/json)

    Disable a User.
    The user should have the `user:PATCH` privilege.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body

+ Response 204 (application/json)
    
    + Body

+ Response 400 (application/json)

    Invalid User Id
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [
                    {
                        "message": "\"user_id\" length must be 24 characters long",
                        "path": "user_id",
                        "type": "string.length",
                        "context": {
                            "limit": 24,
                            "value": "58027aef7e56a7ce62fb23c7g",
                            "key": "user_id"
                        }
                    }
                ]
            }

+ Response 403 (application/json)

    The current user has not the privilege to access this.
    
    + Body
        
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotPermitted"
            }
            
+ Response 404 (application/json)

    User not found.
    
    + Body
        
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoUserFound"
            }
            
+ Response 409 (application/json)

    User already disabled.
    
    + Body
        
            {
                "statusCode": 409,
                "error": "Conflict",
                "message": "UserAlreadyDisabled"
            }
            
### Enable a user [PATCH /admin/user/{id}/enable]

+ Request (application/json)

    Enable a User.
    The user should have the `user:PATCH` privilege.

    + Headers
    
            X-Geev-Token: VEao1HjQWFkrHKuclKUgIIlTlJ0AhNIc85sNtMNdEyenYGK
    
    + Body

+ Response 204 (application/json)
    
    + Body

+ Response 400 (application/json)

    Invalid User Id
    
    + Body
        
            {
                "statusCode": 400,
                "error": "Bad Request",
                "message": "InvalidInput",
                "details": [
                    {
                        "message": "\"user_id\" length must be 24 characters long",
                        "path": "user_id",
                        "type": "string.length",
                        "context": {
                            "limit": 24,
                            "value": "58027aef7e56a7ce62fb23c7g",
                            "key": "user_id"
                        }
                    }
                ]
            }

+ Response 403 (application/json)

    The current user has not the privilege to access this.
    
    + Body
        
            {
                "statusCode": 403,
                "error": "Forbidden",
                "message": "NotPermitted"
            }
            
+ Response 404 (application/json)

    User not found.
    
    + Body
        
            {
                "statusCode": 404,
                "error": "Not Found",
                "message": "NoUserFound"
            }
            
+ Response 409 (application/json)

    User not disabled.
    
    + Body
        
            {
                "statusCode": 409,
                "error": "Conflict",
                "message": "UserNotDisabled"
            }
