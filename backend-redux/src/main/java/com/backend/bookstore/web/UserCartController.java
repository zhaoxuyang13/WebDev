package com.backend.bookstore.web;

import com.alibaba.fastjson.JSON;
import com.backend.bookstore.entity.Beans.CartChangeBean;
import com.backend.bookstore.entity.Order;
import com.backend.bookstore.entity.OrderItem;
import com.backend.bookstore.entity.ShoppingCart;
import com.backend.bookstore.entity.UserData;
import com.backend.bookstore.service.BookService;
import com.backend.bookstore.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.annotation.PostConstruct;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Objects;


@RestController
@RequestMapping(value = "/UserCart", produces = "application/json;charset=UTF-8")
@CrossOrigin(origins = "http://localhost:3000")
public class UserCartController {

    @Autowired
    private OrderService orderService;
    @Autowired
    private BookService bookService;

    @PostConstruct
    public void init(){ }

    @RequestMapping(value = "/", method = RequestMethod.GET)
    public String get(HttpSession session){
        ShoppingCart cart = (ShoppingCart) session.getAttribute("Cart");
        UserData user = (UserData) session.getAttribute("User");
        if(cart == null || !(boolean) session.getAttribute("isLogin")){
            return null;
        }
        return JSON.toJSONString(cart);
    }


    @RequestMapping(value = "/", method = RequestMethod.POST)
    public String postStrings(@RequestBody CartChangeBean cartChange, HttpSession session){
        ShoppingCart cart = (ShoppingCart) session.getAttribute("Cart");
        if (cart == null) {
            cart = new ShoppingCart();
            session.setAttribute("Cart", cart);
        }
        if (cartChange.getAction().equals("add"))
            cart.addItem(cartChange.getBookID(),cartChange.getNumber());
        if (cartChange.getAction().equals("remove"))
            cart.removeItem(cartChange.getBookID(),cartChange.getNumber());
        cart.listCart();
        return JSON.toJSONString(cart);
    }
    @RequestMapping(value = "/", method = RequestMethod.PUT)
    public String makeOrder(HttpSession session){
        ShoppingCart cart = (ShoppingCart) session.getAttribute("Cart");
        if (cart == null) {
            return "errorinfo: no cart exist";
        }
        UserData user = (UserData) session.getAttribute("User");
        if(user == null){
            return "errorInfo: no user exist";
        }
        int orderID = orderService.insertNewOrder(
                new Order(user.getUserID())
        );
        /* Need  Transaction  V */
        ArrayList<OrderItem> orderItems = cart.getOrderItems(orderID);
        for(OrderItem item: orderItems){
            int orderItemID = orderService.insertNewOrderItem(item);
            item.setOrderItemID(orderItemID);
        }
        bookService.RemoveFromStorage(orderItems);
        /* Need Transaction   A */
        cart.clearCart();
        return JSON.toJSONString(cart);
    }
}

