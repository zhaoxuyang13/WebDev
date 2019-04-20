package com.backend.bookstore.entity;


public class OrderItem{
    private int orderItemID;
    private int orderID;
    private int bookID;
    private int bookNum;

    public int getOrderItemID() {
        return orderItemID;
    }

    public void setOrderItemID(int orderItemID) {
        this.orderItemID = orderItemID;
    }

    public int getOrderID() {
        return orderID;
    }

    public void setOrderID(int orderID) {
        this.orderID = orderID;
    }

    public int getBookID() {
        return bookID;
    }

    public void setBookID(int bookID) {
        this.bookID = bookID;
    }

    public int getBookNum() {
        return bookNum;
    }

    public void setBookNum(int bookNum) {
        this.bookNum = bookNum;
    }

    public OrderItem(int orderItemID, int orderID, int bookID, int bookNum) {
        this.orderItemID = orderItemID;
        this.orderID = orderID;
        this.bookID = bookID;
        this.bookNum = bookNum;
    }
}
