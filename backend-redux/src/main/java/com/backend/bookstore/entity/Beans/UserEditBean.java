package com.backend.bookstore.entity.Beans;

import com.backend.bookstore.entity.UserData;

public class UserEditBean {
    String operation;
    UserData userData;

    public String getOperation() {
        return operation;
    }

    public void setOperation(String operation) {
        this.operation = operation;
    }

    public UserData getUserData() {
        return userData;
    }

    public void setUserData(UserData userData) {
        this.userData = userData;
    }

    public UserEditBean(String operation, UserData userData) {
        this.operation = operation;
        this.userData = userData;
    }
}
