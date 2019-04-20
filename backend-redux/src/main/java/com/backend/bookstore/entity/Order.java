package com.backend.bookstore.entity;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Order {

    int orderID;
    String orderTime;
    int userID;

    private static String getCurrentTime(){
        Date dNow = new Date( );
        SimpleDateFormat ft = new SimpleDateFormat ("yyyy-MM-dd hh:mm:ss");
        return ft.format(dNow);
    }
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public Order(int userID) {
        this.orderID = -1;
        this.userID = userID;
        this.orderTime = getCurrentTime();
    }

    public int getOrderID() {
        return orderID;
    }

    public void setOrderID(int orderID) {
        this.orderID = orderID;
    }

    public String getOrderTime() {
        return orderTime;
    }

    public void setOrderTime(String orderTime) {
        this.orderTime = orderTime;
    }
}