package com.backend.bookstore.entity;

public class UserData {
    public UserData(int userID, String username, String email, String password, String userAuth) {
        this.userID = userID;
        this.username = username;
        this.email = email;
        this.password = password;
        this.userAuth = userAuth;
    }

    public UserData() {
    }

    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getUserAuth() {
        return userAuth;
    }

    public void setUserAuth(String userAuth) {
        this.userAuth = userAuth;
    }

    private int userID;
    private String username;
    private String email;
    private String password;
    private String userAuth;
}
