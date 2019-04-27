package com.backend.bookstore.entity;

import com.backend.bookstore.entity.Beans.CartChangeBean;

import java.util.ArrayList;

class CartItem{
    public int bookID;
    public int number;

    public int getBookID() {
        return bookID;
    }

    public int getNumber() {
        return number;
    }

    public CartItem(int bookID, int number) {
        this.bookID = bookID;
        this.number = number;
    }
}
public class ShoppingCart{
    private ArrayList<CartItem> items;

    public void clearCart(){
        items.clear();
    }

    public ArrayList<CartItem> getItems() {
        return items;
    }

    public ArrayList<OrderItem> getOrderItems(int orderID) {
        ArrayList<OrderItem> orderItems = new ArrayList<>();
        for(CartItem item : items){
            orderItems.add(
                    new OrderItem(0,orderID,item.bookID,item.number,0)
            );
        }
        return orderItems;
    }

    public ShoppingCart() {
        items = new  ArrayList<>();
    }

    public void listCart(){
        for(int i =0 ; i<items.size();i ++)
        {
            System.out.println(items.get(i).bookID +" "+ items.get(i).number);
        }
    }
    public void addItem(int bookID, int number){
        boolean existItem = false;
        for(int i = 0;i < items.size(); i++){
            if(items.get(i).bookID == bookID) {
                items.get(i).number += number;
                existItem = true;
                break;
            }
        }
        if(!existItem) {
            CartItem i = new CartItem(bookID,number);
            items.add(i);
        }
    }
    public void removeItem(int bookID,int number){
        for(int i = 0; i < items.size(); i++){
            if(items.get(i).bookID == bookID){
                if((items.get(i).number -= number) <= 0){
                    items.remove(i);
                }
                break;
            }
        }
    }

}