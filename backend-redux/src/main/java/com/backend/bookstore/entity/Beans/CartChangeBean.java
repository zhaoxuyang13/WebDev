package com.backend.bookstore.entity.Beans;

public class CartChangeBean {
    private int bookID;
    private String action;
    private int number;

    public int getBookID() {
        return bookID;
    }

    public void setBookID(int bookID) {
        this.bookID = bookID;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public int getNumber() {
        return number;
    }

    public void setNumber(int number) {
        this.number = number;
    }

    public CartChangeBean(int bookID, String action, int number) {
        this.bookID = bookID;
        this.action = action;
        this.number = number;
    }
}
