class AccountMessage:
    ACCOUNT_EXISTS_VERIFY = (
        "Account created successfully. Please check your email to verify."
    )
    ACCOUNT_EXISTS = "Account already exists."
    ACCOUNT_VERIFY_SUCCESS = "Token Verify Success"
    ACCOUNT_VERIFY_FAIL = "Token Verify Fail"
    ACCOUNT_LOGIN_FAIL_EMAIL = "Email is wrong or not exists"
    ACCOUNT_LOGIN_FAIL_PASSWORD = "Password is wrong"
    ACCOUNT_NOT_FOUND = "Account is not found"
    ACCOUNT_MISS_PARAM = "Email, password is none"
    ## ERROR
    ERROR_CREATE_ACCOUNT = "Unable to create account. Please try again later."
    ERROR_LOGIN_ACCOUNT = "Unable to login account. Please try again later."
    ERROR_GET_INFOR_ACCOUNT = "Fail get information account"
    ERROR_REFRESH_TOKEN = "Fail create token access_token"
    ERROR_ACCOUNT_DIF_PROVIDER = "Fail account difference type"
